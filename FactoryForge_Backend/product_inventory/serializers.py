from rest_framework import serializers
from product_inventory.models import ProductInventory


class ProductInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductInventory
        fields = ['id', 'name', 'description', 'user', 'last_restock']

    def create(self, validated_data):
        if 'user' not in validated_data:
            user = self.context['request'].user
            validated_data['user'] = user

        return super().create(validated_data)
