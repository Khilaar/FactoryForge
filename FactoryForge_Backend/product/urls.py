from django.urls import path

from product.views import ListCreateProductView, RetrieveUpdateDeleteProduct


urlpatterns = [
    path('', ListCreateProductView.as_view()),
    path('<int:product_id>/', RetrieveUpdateDeleteProduct.as_view()),
    # path('estimate/', estimate),
]