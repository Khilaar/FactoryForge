from django.contrib import admin

from inventory.models import Inventory


class InventoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'last_restock']


admin.site.register(Inventory, InventoryAdmin)
