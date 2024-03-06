from django.db import models
from django.db.models import OneToOneField


class Inventory(models.Model):
    name = models.CharField(max_length=250, default='raw_material_inventory')
    description = models.TextField(blank=True, null=True, default='This inventory holds all raw materials.')
    user = OneToOneField('custom_user.CustomUser', on_delete=models.CASCADE)
    last_restock = models.DateTimeField(auto_now=True, blank=True)

    def __str__(self):
        return f'{self.name}'


