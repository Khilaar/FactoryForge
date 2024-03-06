from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from factoryforge.permissions.permissions import ReadOnly
from raw_material_order.models import RawMaterialOrder
from raw_material_order.serializers import RawMaterialOrderSerializer


class RawMaterialOrderListCreateView(ListCreateAPIView):
    serializer_class = RawMaterialOrderSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_queryset(self):
        queryset = RawMaterialOrder.objects.all().exclude(status=3)
        return queryset


class RetrieveUpdateDeleteRawMaterialOrder(RetrieveUpdateDestroyAPIView):
    queryset = RawMaterialOrder.objects.all()
    serializer_class = RawMaterialOrderSerializer
    permission_classes = [IsAuthenticated | ReadOnly]
    lookup_url_kwarg = 'raw_material_order_id'


class RawMaterialOrderHistoryListView(ListCreateAPIView):
    serializer_class = RawMaterialOrderSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_queryset(self):
        queryset = RawMaterialOrder.objects.all().filter(status=3)
        return queryset
