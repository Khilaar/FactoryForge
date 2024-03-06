from rest_framework import serializers

from inventory.models import Inventory
from raw_material.models import RawMaterial


#######################################################################################################
class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id', 'name', 'description', 'user', 'last_restock']

    def create(self, validated_data):
        if 'user' not in validated_data:
            user = self.context['request'].user
            validated_data['user'] = user

        return super().create(validated_data)


#######################################################################################################

class RawMaterialInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = ['id', 'name', 'quantity_available', 'restock_required', 'max_quantity', 'inventory']

#######################################################################################################
