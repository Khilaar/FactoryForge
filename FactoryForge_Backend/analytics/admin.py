from django.contrib import admin
from .models import Analytics

class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'description')

# Register the Analytics model with its admin class
admin.site.register(Analytics, AnalyticsAdmin)