from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from custom_user.models import CustomUser
from inventory.models import Inventory
from raw_material.models import RawMaterial
from raw_material_order.models import RawMaterialOrder


class CustomSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'username', 'type_of_user', 'email')


class CustomRawMaterialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = ['id', 'name']


class RawMaterialOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterialOrder
        fields = ['id', 'raw_materials', 'quantity', 'supplier', 'order_date', 'delivery_date', 'status',
                  'raw_materials_order']

    def create(self, validated_data):
        raw_materials_ordered_data = validated_data.pop('raw_materials_order', [])
        rawmats_ids = validated_data.pop('raw_materials', [])

        with transaction.atomic():
            rawmats_order = RawMaterialOrder.objects.create(**validated_data)

            if rawmats_order.supplier.type_of_user != 'S':
                raise serializers.ValidationError('Supplier not found or wrong type.')

            rawmats_order.raw_materials.set(rawmats_ids)
            raw_materials_specifics = {}

            if raw_materials_ordered_data:
                for raw_material_name, quantity in raw_materials_ordered_data.items():
                    try:
                        raw_material = RawMaterial.objects.get(name__iexact=raw_material_name)
                    except RawMaterial.DoesNotExist:
                        raise serializers.ValidationError(f'RawMaterial "{raw_material_name}" does not exist')
                    if raw_material.max_quantity < quantity:
                        raise serializers.ValidationError(
                            f"{quantity} exceeds {raw_material.name} max quantity {raw_material.max_quantity}")
                    raw_materials_specifics[raw_material.id] = quantity

            rawmats_order.raw_materials_order = raw_materials_specifics
            rawmats_order.save()
        return rawmats_order

    def update(self, instance, validated_data):
        if instance.status == 3:
            raise serializers.ValidationError('This order has already been completed.')

        raw_materials_ordered_data = validated_data.pop('raw_materials_order', [])
        with transaction.atomic():
            instance = super().update(instance, validated_data)

            if instance.supplier.type_of_user != 'S':
                raise serializers.ValidationError('Supplier not found or wrong type.')

            rawmats_order_update = {}

            if len(raw_materials_ordered_data) > 0:
                for raw_material_name, quantity in raw_materials_ordered_data.items():
                    try:
                        raw_material = RawMaterial.objects.get(name__iexact=raw_material_name)
                    except RawMaterial.DoesNotExist:
                        raise serializers.ValidationError(f'RawMaterial "{raw_material_name}" does not exist')
                    if raw_material.max_quantity > quantity:
                        rawmats_order_update[raw_material.id] = quantity
                    else:
                        raise serializers.ValidationError(
                            f"{quantity} exceeds {raw_material.name} maximum quantity of {raw_material.max_quantity}")
                instance.raw_materials_order = rawmats_order_update
            instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['supplier'] = CustomSupplierSerializer(instance.supplier).data
        representation['raw_materials'] = CustomRawMaterialsSerializer(instance.raw_materials.all(), many=True).data
        return representation

    def save(self, *args, **kwargs):
        if self.validated_data.get('status') == 3:
            with transaction.atomic():
                super().save(*args, **kwargs)
                raw_materials_order_data = self.data.get('raw_materials_order', {})
                for raw_material_id, quantity in raw_materials_order_data.items():
                    try:
                        raw_material = RawMaterial.objects.get(id=raw_material_id)
                    except RawMaterial.DoesNotExist:
                        raise serializers.ValidationError(f'RawMaterial with ID "{raw_material_id}" does not exist')
                    to_update = raw_material.quantity_available + quantity
                    if to_update <= raw_material.max_quantity:
                        raw_material.quantity_available += quantity
                    else:
                        raise serializers.ValidationError(
                            f"{to_update} exceeds {raw_material.name}'s maximum storage of {raw_material.max_quantity} ")
                    raw_material.save()
                self.update_inventory_last_restock()
        else:
            super().save(*args, **kwargs)

    def update_inventory_last_restock(self):
        inventory = Inventory.objects.all().first()
        if not inventory:
            raise serializers.ValidationError('Create an inventory first')
        inventory.last_restock = timezone.now()
        inventory.save()
