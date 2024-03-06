from django.apps import AppConfig


class ProductInventoryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "product_inventory"

    def ready(self):
        import product_inventory.signals