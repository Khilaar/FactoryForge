from django.contrib import admin

from product.models import Product


class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'description', 'quantity_available', 'price', 'production_cost', 'category',
        'raw_material_requirements',)


admin.site.register(Product, ProductAdmin)
