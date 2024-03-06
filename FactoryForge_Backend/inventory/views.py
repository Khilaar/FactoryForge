from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from factoryforge.permissions.permissions import ReadOnly
from inventory.models import Inventory
from inventory.serializers import InventorySerializer, RawMaterialInventorySerializer
from raw_material.models import RawMaterial


#######################################################################################################

# Here we Can create an view an Inventory. The User at the moment can create only one inventory
class ListCreateInventoryView(ListCreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated | ReadOnly]


#######################################################################################################

# Here we can get the items in the inventory by inserting the inventory name in the url
class RawMaterialsByInventoryView(ListAPIView):
    serializer_class = RawMaterialInventorySerializer

    def get_queryset(self):
        inventory_name = Inventory.objects.first()
        return RawMaterial.objects.filter(inventory__name=inventory_name)


#######################################################################################################

# Here we can get the details of a single item of the inventory (raw_material) by adding the name into the url
class RawMaterialDetailView(RetrieveAPIView):
    serializer_class = RawMaterialInventorySerializer

    def get_queryset(self):
        inventory_name = Inventory.objects.first()
        return RawMaterial.objects.filter(inventory__name=inventory_name)

    lookup_field = 'name'

    def get_object(self):
        queryset = self.get_queryset()

        name = self.kwargs['name'].lower()

        filter_kwargs = {self.lookup_field + '__icontains': name}
        obj = queryset.filter(**filter_kwargs).first()

        if obj is None:
            raise ValidationError("No such RawMaterial")

        return obj

#######################################################################################################
