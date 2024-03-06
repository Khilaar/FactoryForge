from django.contrib import admin
from django.urls import path, include

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt import views as jwt_views


schema_view = get_schema_view(
    openapi.Info(
        title="Django API",
        default_version='v1',
        description="Description of your Django App",
        terms_of_service="https://www.google.com/policies/terms/",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),

)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/products/', include('product.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/productinventory/', include('product_inventory.urls')),
    path('api/users/', include('custom_user.urls')),
    path('api/client_orders/', include('client_order.urls')),
    path('api/suppliers/', include('supplier.urls')),
    path('api/raw_materials/', include('raw_material.urls')),
    path('api/raw_materials_orders/', include('raw_material_order.urls')),
    path('api/analytics/', include('analytics.urls')),

    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_refresh'),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
