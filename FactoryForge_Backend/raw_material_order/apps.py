from django.apps import AppConfig


class RawMaterialOrderConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "raw_material_order"

    def ready(self):
        import raw_material_order.signals