from django.urls import path

from inventory.views import ListCreateInventoryView, RawMaterialsByInventoryView, RawMaterialDetailView


urlpatterns = [
    #Create an inventory with post-request
    path('create/', ListCreateInventoryView.as_view()),
    #Get all the items in inventory with get-request
    path('', RawMaterialsByInventoryView.as_view(), name='raw_materials_by_inventory'),
    #Get items with a certain name wit get-request
    path('<name>/', RawMaterialDetailView.as_view(), name='raw_material_detail'),
]