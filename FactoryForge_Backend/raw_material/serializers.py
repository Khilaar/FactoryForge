from rest_framework import serializers
from inventory.models import Inventory
from raw_material.models import RawMaterial


class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = ['id', 'name', 'quantity_available', 'restock_required', 'inventory', 'max_quantity', 'cost']

    def create(self, validated_data):
        inventory = Inventory.objects.all().first()
        if not inventory:
            raise serializers.ValidationError('Create an inventory first')
        validated_data['inventory'] = inventory
        return RawMaterial.objects.create(**validated_data)

    def save(self, **kwargs):
        instance = super().save(**kwargs)
        if instance.quantity_available > instance.max_quantity:
            raise serializers.ValidationError(
                f"{instance.name} quantity cannot be greater than {instance.max_quantity}")
        threshold = instance.max_quantity * 0.15
        if instance.quantity_available < threshold and not instance.restock_required:
            instance.restock_required = True
            instance.save()
        elif instance.quantity_available > threshold:
            instance.restock_required = False
            instance.save()
        if instance.quantity_available < 0:
            raise serializers.ValidationError(f"{instance.name} quantity cannot be negative.")
        return instance
