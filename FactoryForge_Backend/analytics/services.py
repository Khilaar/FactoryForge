from datetime import datetime

from django.db.models import Q
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from analytics import serializers
from client_order.models import ClientOrder
from product.models import Product
from raw_material.models import RawMaterial
from raw_material_order.models import RawMaterialOrder


#######################################################################################################

def calculate_total_income(start_date, end_date):
    start_date = timezone.make_aware(datetime.strptime(start_date, "%Y-%m-%d"))
    end_date = timezone.make_aware(datetime.strptime(end_date, "%Y-%m-%d"))

    client_orders = ClientOrder.objects.all().filter(created__range=[start_date, end_date])

    client_orders_completed = client_orders.filter(order_status__in=[5, 6])
    client_orders_inprogress = client_orders.exclude(order_status__in=[5, 6])

    total_income = 0
    for order in client_orders_completed:
        ordered_products = order.orderedproduct_set.all()
        if ordered_products is not None:
            for ordered_product in ordered_products:
                price = ordered_product.product.price
                quantity = ordered_product.quantity
                total_income += price * quantity

    incomplete_income = 0

    for order in client_orders_inprogress:
        ordered_products = order.orderedproduct_set.all()
        if ordered_products is not None:
            for ordered_product in ordered_products:
                price = ordered_product.product.price
                quantity = ordered_product.quantity
                incomplete_income += price * quantity

    return [total_income, incomplete_income]


#######################################################################################################

def calculate_total_cost(start_date, end_date):
    start_date = timezone.make_aware(datetime.strptime(start_date, "%Y-%m-%d"))
    end_date = timezone.make_aware(datetime.strptime(end_date, "%Y-%m-%d"))

    raw_material_orders = RawMaterialOrder.objects.all().filter(order_date__range=[start_date, end_date])

    total_cost = 0
    for order in raw_material_orders:
        if order.raw_materials_order is not None:
            for material, quantity in order.raw_materials_order.items():
                try:
                    raw_material = RawMaterial.objects.get(id=material)
                except RawMaterial.DoesNotExist:
                    raise ValidationError(f"RawMaterial with ID {material} does not exist.")
                cost = raw_material.cost
                total_cost += cost * quantity

    return total_cost


#######################################################################################################

def calculate_profit(start_date, end_date):
    total_income = calculate_total_income(start_date, end_date)
    total_income_complete = total_income[0]

    incomplete_income = total_income[1]

    total_cost = calculate_total_cost(start_date, end_date)
    total_profit = total_income_complete - total_cost

    return {"profit": total_profit, "Incomplete Income": incomplete_income, "Total Cost": total_cost}


#######################################################################################################

def used_rawmats_and_sold_products(start_date, end_date):
    start_date = timezone.make_aware(datetime.strptime(start_date, "%Y-%m-%d"))
    end_date = timezone.make_aware(datetime.strptime(end_date, "%Y-%m-%d"))

    client_orders = ClientOrder.objects.all().filter(
        Q(created__range=[start_date, end_date]) & Q(order_status__in=[5, 6]))

    all_raw_mats = {}
    sold_products = {}

    for order in client_orders:
        ordered_products = order.orderedproduct_set.all()
        for p in ordered_products:
            product = Product.objects.get(id=p.product_id)
            add_product_to_sold_products(sold_products, product, p.quantity)
            add_raw_material_to_allrawmats(all_raw_mats, product.raw_material_requirements)

    converted_list = convert_raw_materials(all_raw_mats)
    return [converted_list, sold_products]


def add_product_to_sold_products(sold_products, product, quantity):
    if product.title in sold_products:
        sold_products[product.title] += quantity
    else:
        sold_products[product.title] = quantity
    return sold_products


def add_raw_material_to_allrawmats(all_raw_mats, raw_materials_list):
    for raw_material_id, quantity in raw_materials_list.items():
        if raw_material_id in all_raw_mats:
            all_raw_mats[raw_material_id] += quantity
        else:
            all_raw_mats[raw_material_id] = quantity
    return all_raw_mats


def convert_raw_materials(raw_materials):
    raw_materials_list = {}
    for raw_material, quantity in raw_materials.items():
        raw_material = RawMaterial.objects.get(id=raw_material)
        raw_materials_list[raw_material.name] = quantity
    return raw_materials_list
