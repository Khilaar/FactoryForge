from django.urls import path
from .views import ListCreateRawMaterialView, RetrieveUpdateDeleteRawMaterialView


urlpatterns = [
    path("", ListCreateRawMaterialView.as_view()),
    path('<int:pk>/', RetrieveUpdateDeleteRawMaterialView.as_view()),
]
