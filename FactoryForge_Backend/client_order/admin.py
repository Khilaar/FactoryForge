from django.contrib import admin

from client_order.models import ClientOrder, OrderedProduct


# Register your models here.
class ClientOrderAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'client', 'due_date', 'created', 'order_status', 'processing_time', 'nr_products',
        'nr_products_completed',)


class OrderedProductAdmin(admin.ModelAdmin):
    list_display = (
        'client_order', 'product', 'production_status', 'quantity'
    )


admin.site.register(ClientOrder, ClientOrderAdmin)
admin.site.register(OrderedProduct, OrderedProductAdmin)
