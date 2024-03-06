from django.contrib import admin

from raw_material_order.models import RawMaterialOrder


class RawMaterialOrderAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'raw_materials_order', 'quantity', 'delivery_date', 'status')


admin.site.register(RawMaterialOrder, RawMaterialOrderAdmin)
