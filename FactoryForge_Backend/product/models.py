from django.db import models

from product_inventory.models import ProductInventory


class Product(models.Model):
    title = models.CharField(max_length=250, unique=True)
    description = models.TextField(blank=True, null=True)
    quantity_available = models.IntegerField(default=0)
    price = models.DecimalField(decimal_places=2, max_digits=8)
    production_cost = models.DecimalField(decimal_places=2, max_digits=8, blank=True, null=True)
    category = models.CharField(max_length=250, blank=True, null=True)
    raw_material_requirements = models.JSONField(null=True, blank=True)
    inventory = models.ForeignKey(ProductInventory, on_delete=models.PROTECT, related_name='products', null=True,
                                  blank=True)

    def __str__(self):
        return self.title
