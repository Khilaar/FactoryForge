from rest_framework import serializers
from custom_user.models import CustomUser


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'first_name', 'last_name', 'basic_user', 'type_of_user', 'description', 'address', 'city',
            'state', 'zipcode', 'phone_number',
            'email', 'verified', 'website', 'created', 'updated')
