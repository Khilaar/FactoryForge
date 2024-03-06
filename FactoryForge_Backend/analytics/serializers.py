from rest_framework import serializers
from analytics.models import Analytics


class AnalyticsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Analytics
        fields = ['name', 'description', 'user', 'inventory', 'product_inventory', 'client_orders', 'raw_material_orders']

