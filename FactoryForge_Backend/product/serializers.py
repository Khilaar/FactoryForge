from django.db import transaction
from rest_framework import serializers
from product.models import Product
from raw_material.models import RawMaterial


class RawMaterialRequirementSerializer(serializers.Serializer):
    raw_material_id = serializers.IntegerField()
    quantity = serializers.IntegerField()


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'quantity_available', 'price', 'production_cost',
                  'category', 'raw_material_requirements']

    def create(self, validated_data):
        requirements_data = validated_data.pop('raw_material_requirements', [])
        with transaction.atomic():
            product = Product.objects.create(**validated_data)

            product_requirements = {}
            cost_of_production = 0

            if requirements_data:
                for raw_material_name, quantity in requirements_data.items():
                    try:
                        raw_material = RawMaterial.objects.get(name__iexact=raw_material_name)
                    except RawMaterial.DoesNotExist:
                        raise serializers.ValidationError(f'RawMaterial "{raw_material_name}" does not exist')
                    product_requirements[raw_material.id] = quantity
                    cost_of_production += (raw_material.cost * quantity)

            product.raw_material_requirements = product_requirements
            product.production_cost = cost_of_production
            product.save()
        return product

    def update(self, instance, validated_data):
        requirements_data = validated_data.pop('raw_material_requirements', [])
        with transaction.atomic():
            instance = super().update(instance, validated_data)

            product_requirements_update = {}

            if len(requirements_data) > 0:
                cost_of_production = 0
                for raw_material_name, quantity in requirements_data.items():
                    try:
                        raw_material = RawMaterial.objects.get(name__iexact=raw_material_name)
                    except RawMaterial.DoesNotExist:
                        raise serializers.ValidationError(f'RawMaterial "{raw_material_name}" does not exist')
                    product_requirements_update[raw_material.id] = quantity
                    cost_of_production += (raw_material.cost * quantity)
                instance.raw_material_requirements = product_requirements_update
                instance.production_cost = cost_of_production

            instance.save()
        return instance
