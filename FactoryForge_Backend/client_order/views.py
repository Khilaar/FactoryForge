from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from client_order.models import ClientOrder
from client_order.serializers import ClientOrderSerializer
from factoryforge.permissions.permissions import ReadOnly


class ClientOrderListCreateView(ListCreateAPIView):
    queryset = ClientOrder.objects.all()
    serializer_class = ClientOrderSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_queryset(self):
        queryset = ClientOrder.objects.all()
        username = self.request.query_params.get('username')
        if username is not None:
            queryset = queryset.filter(client__username=username)
        else:
            queryset = queryset.exclude(order_status__in=[5, 6])
        return queryset


class RetrieveUpdateDeleteClientOrder(RetrieveUpdateDestroyAPIView):
    queryset = ClientOrder.objects.all()
    serializer_class = ClientOrderSerializer
    permission_classes = [IsAuthenticated | ReadOnly]
    lookup_url_kwarg = 'client_order_id'


class ClientOrderHistoryListView(ListAPIView):
    queryset = ClientOrder.objects.all()
    serializer_class = ClientOrderSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_queryset(self):
        queryset = ClientOrder.objects.all().filter(order_status__in=[5, 6])
        return queryset
