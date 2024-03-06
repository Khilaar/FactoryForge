from django.urls import path

from raw_material_order.views import RawMaterialOrderListCreateView, RetrieveUpdateDeleteRawMaterialOrder, \
    RawMaterialOrderHistoryListView


urlpatterns = [
    path('', RawMaterialOrderListCreateView.as_view()),
    path('<int:raw_material_order_id>/', RetrieveUpdateDeleteRawMaterialOrder.as_view()),
    path('history/', RawMaterialOrderHistoryListView.as_view())
]