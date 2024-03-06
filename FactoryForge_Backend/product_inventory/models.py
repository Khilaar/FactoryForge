from django.db import models
from django.db.models import OneToOneField, TextField


class ProductInventory(models.Model):
    name = models.CharField(max_length=250, default="product_inventory")
    description = TextField(blank=True, null=True, default="This inventory holds all your finished products.")
    user = OneToOneField('custom_user.CustomUser', on_delete=models.PROTECT, blank=True, null=True)
    last_restock = models.DateTimeField(auto_now=True, blank=True)

    def __str__(self):
        return f'{self.name}'
