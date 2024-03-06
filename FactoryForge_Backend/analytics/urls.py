from django.urls import path

from analytics.views import ListCreateAnalyticsView, ProfitView, UsedRawMaterialsSoldProductsView

urlpatterns = [
    path('', ListCreateAnalyticsView.as_view()),
    path('profit/', ProfitView.as_view()),
    path('statistics/', UsedRawMaterialsSoldProductsView.as_view())
]