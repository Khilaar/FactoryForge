from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from factoryforge.permissions.permissions import ReadOnly
from product.models import Product
from product.serializers import ProductSerializer
from product_inventory.models import ProductInventory
from product_inventory.serializers import ProductInventorySerializer


#######################################################################################################

class ListCreateProductInventoryView(ListCreateAPIView):
    queryset = ProductInventory.objects.all()
    serializer_class = ProductInventorySerializer
    permission_classes = [IsAuthenticated | ReadOnly]


#######################################################################################################

class ProductsByInventoryView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        inventory_name = self.kwargs['inventory_name']
        return Product.objects.filter(inventory__name=inventory_name)

#######################################################################################################
