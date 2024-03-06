from django.contrib import admin
from .models import ProductInventory


class ProductInventoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'last_restock')
    search_fields = ('name', 'user__username')

# Register the ProductInventory model with its admin class
admin.site.register(ProductInventory, ProductInventoryAdmin)