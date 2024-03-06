from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import OneToOneField

from inventory.models import Inventory


def user_directory_path(instance, filename):
    return f'user_{instance.user.id}/{filename}'


# Create your models here.
class CustomUser(AbstractUser):
    TYPE_OF_USER_CHOICES = [
        ('C', 'Client'),
        ('A', 'Administrator'),
        ('S', 'Supplier'),
    ]

    basic_user = models.ForeignKey('basic_user.BasicUser', on_delete=models.PROTECT, blank=True, null=True)
    type_of_user = models.CharField(max_length=1, choices=TYPE_OF_USER_CHOICES, default='A')
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=250, blank=True, null=True)
    city = models.CharField(max_length=250, blank=True, null=True)
    state = models.CharField(max_length=250, blank=True, null=True)
    zipcode = models.CharField(max_length=250, blank=True, null=True)
    country = models.CharField(max_length=250, blank=True, null=True)
    phone_number = models.CharField(max_length=250, blank=True, null=True)
    verified = models.BooleanField(default=True)
    website = models.URLField(blank=True, null=True)
    avatar = models.ImageField(upload_to='user_directory_path', blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f'{self.username}'
