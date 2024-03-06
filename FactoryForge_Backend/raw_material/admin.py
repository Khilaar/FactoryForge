from django.contrib import admin

from raw_material.models import RawMaterial


class RawMaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity_available', 'restock_required', 'max_quantity')


admin.site.register(RawMaterial, RawMaterialAdmin)
