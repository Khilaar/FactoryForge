from django.apps import AppConfig


class BasicUserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "basic_user"

    def ready(self):
        import basic_user.signals
