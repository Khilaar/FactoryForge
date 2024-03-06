from django.urls import path
from client_order.views import ClientOrderListCreateView, RetrieveUpdateDeleteClientOrder, ClientOrderHistoryListView


urlpatterns = [
    path('', ClientOrderListCreateView.as_view()),
    path('<int:client_order_id>/', RetrieveUpdateDeleteClientOrder.as_view()),
    path('history/', ClientOrderHistoryListView.as_view())
]