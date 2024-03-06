from django.apps import AppConfig


class ClientOrderConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "client_order"

    def ready(self):
        import client_order.signals