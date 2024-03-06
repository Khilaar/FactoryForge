from django.db import models


class RawMaterial(models.Model):
    name = models.CharField(max_length=250, unique=True)
    quantity_available = models.IntegerField(default=0)
    restock_required = models.BooleanField(default=False)
    max_quantity = models.IntegerField(default=0)
    cost = models.DecimalField(decimal_places=2, max_digits=8, blank=True, null=True, default=0)
    inventory = models.ForeignKey('inventory.Inventory', on_delete=models.PROTECT, blank=True, null=True)

    def __str__(self):
        return self.name
