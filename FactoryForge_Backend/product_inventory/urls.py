from django.urls import path
from product_inventory.views import ListCreateProductInventoryView, ProductsByInventoryView


urlpatterns = [
    path('', ListCreateProductInventoryView.as_view()),
    path('<str:inventory_name>', ProductsByInventoryView.as_view(), name='raw_materials_by_inventory'),

]