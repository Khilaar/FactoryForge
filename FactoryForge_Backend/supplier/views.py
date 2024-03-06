from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from custom_user.models import CustomUser
from factoryforge.permissions.permissions import ReadOnly
from raw_material_order.models import RawMaterialOrder
from raw_material_order.serializers import RawMaterialOrderSerializer
from supplier.serializers import SupplierSerializer


class SupplierListView(ListAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_queryset(self):
        queryset = CustomUser.objects.filter(type_of_user='S')
        return queryset


class RetrieveUpdateDeleteSupplierView(RetrieveUpdateDestroyAPIView):
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated | ReadOnly]
    lookup_url_kwarg = 'supplier_id'

    def get_queryset(self):
        queryset = CustomUser.objects.filter(type_of_user='S')
        return queryset


class SupplierHistoryView(ListAPIView):
    serializer_class = RawMaterialOrderSerializer
    permission_classes = [IsAuthenticated | ReadOnly]
    lookup_url_kwarg = 'supplier_id'

    def get_queryset(self):
        supplier_id = self.kwargs['supplier_id']
        try:
            supplier = CustomUser.objects.get(id=supplier_id, type_of_user='S')
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Supplier not found.')

        queryset = RawMaterialOrder.objects.filter(supplier=supplier_id)
        return queryset
