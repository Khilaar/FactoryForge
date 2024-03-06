from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from factoryforge.permissions.permissions import ReadOnly
from raw_material.models import RawMaterial
from raw_material.serializers import RawMaterialSerializer


class ListCreateRawMaterialView(ListCreateAPIView):
    queryset = RawMaterial.objects.all()
    serializer_class = RawMaterialSerializer
    permission_classes = [IsAuthenticated | ReadOnly]


class RetrieveUpdateDeleteRawMaterialView(RetrieveUpdateDestroyAPIView):
    queryset = RawMaterial.objects.all()
    serializer_class = RawMaterialSerializer
    permission_classes = [IsAuthenticated | ReadOnly]
