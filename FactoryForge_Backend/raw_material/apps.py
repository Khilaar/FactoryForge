from django.apps import AppConfig


class RawMaterialConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "raw_material"

    def ready(self):
        import raw_material.signals