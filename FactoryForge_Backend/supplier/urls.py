from django.urls import path
from supplier.views import SupplierListView, RetrieveUpdateDeleteSupplierView, SupplierHistoryView


urlpatterns = [
    path('', SupplierListView.as_view()),
    path('<int:supplier_id>/', RetrieveUpdateDeleteSupplierView.as_view()),
    path('<int:supplier_id>/history/', SupplierHistoryView.as_view())
]