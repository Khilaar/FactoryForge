import uuid

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from client_order.models import ClientOrder, OrderedProduct
from custom_user.models import CustomUser
from product.models import Product
from raw_material.models import RawMaterial


class OrderedProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product', write_only=True)

    class Meta:
        model = OrderedProduct
        fields = ['product_name', 'product', 'quantity', 'production_status']


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'username', 'email']


class ClientOrderSerializer(serializers.ModelSerializer):
    ordered_products = OrderedProductSerializer(many=True)

    class Meta:
        model = ClientOrder
        fields = ['id', 'client', 'ordered_products', 'client_note', 'due_date', 'created', 'updated', 'delivery_time',
                  'processing_time', 'order_status', 'nr_products', 'nr_products_completed',
                  'tracking_number']

    def create(self, validated_data):
        user_type = validated_data.get('client')
        if user_type.type_of_user != 'C':
            raise serializers.ValidationError('User is not of type client.')

        ordered_products_data = validated_data.pop('ordered_products', [])
        with transaction.atomic():
            client_order = ClientOrder.objects.create(**validated_data)
            client_order.nr_products = len(ordered_products_data)
            client_order.tracking_number = self.generate_tracking_number(client_order)
            for p in ordered_products_data:
                try:
                    p_name = p['product']
                    p_quantity = p['quantity']
                    product_id = Product.objects.get(title__iexact=p_name)
                except Product.DoesNotExist:
                    raise serializers.ValidationError(f"Product with name {p} does not exist.")
                if p_quantity < 0:
                    raise serializers.ValidationError('Quantity cannot be negative.')
                OrderedProduct.objects.create(client_order=client_order, product=product_id, quantity=p_quantity)
            client_order.save()
        return client_order

    def update(self, instance, validated_data):
        if instance.order_status == 6:
            raise serializers.ValidationError('This order has already been completed.')

        products_data = validated_data.pop('ordered_products', [])

        with transaction.atomic():
            instance = super().update(instance, validated_data)
            instance.updated = timezone.now()
            user_type = validated_data.get('client')
            if user_type and user_type.type_of_user != 'C':
                raise serializers.ValidationError('User is not of type client.')

            if len(products_data) > 0:
                ordered_products = instance.ordered_products.all()
                ordered_product_ids = [p.id for p in ordered_products]

                for p_data in products_data:
                    p_name = p_data['product']
                    p_quantity = p_data['quantity']

                    try:
                        product = Product.objects.get(title__iexact=p_name)
                    except Product.DoesNotExist:
                        raise serializers.ValidationError(f"Product with name {p_name} does not exist.")

                    if p_quantity < 0:
                        raise serializers.ValidationError('Quantity cannot be negative.')

                    if product.id in ordered_product_ids:
                        ordered_p = OrderedProduct.objects.get(client_order=instance, product=product)
                        ordered_p.quantity = p_quantity
                        ordered_p.save()
                    else:
                        OrderedProduct.objects.create(client_order=instance, product=product, quantity=p_quantity)
                OrderedProduct.objects.filter(client_order=instance).exclude(
                    product__title__in=[p['product'] for p in products_data]).delete()
            instance.nr_products = len(instance.ordered_products.all())
            instance.save()

            if instance.order_status == 6:
                self.adjust_raw_material_inventory()

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['client'] = ClientSerializer(instance.client).data
        ordered_products_data = OrderedProduct.objects.filter(client_order=instance.id)
        representation['ordered_products'] = OrderedProductSerializer(ordered_products_data, many=True).data
        return representation

    def generate_tracking_number(self, client_order):
        unique_id = str(uuid.uuid4()).replace('-', '').upper()[:12]
        unique_info = f'{client_order.client.id}'
        tracking_number = f'TN-{unique_info}-{unique_id}'
        return tracking_number

    def adjust_raw_material_inventory(self):
        with transaction.atomic():
            products_data = self.data.get('ordered_products')
            if products_data:
                product_ids = [p.get('product') for p in products_data]
                products = Product.objects.filter(id__in=product_ids)
                product_map = {product.id: product for product in products}

                for p in products_data:
                    product_id = p.get('product')
                    product_quantity = p.get('quantity')
                    product_requirements = product_map[product_id].raw_material_requirements

                    for raw_mat_id, required_quantity in product_requirements.items():
                        try:
                            raw_material = RawMaterial.objects.get(id=raw_mat_id)
                        except RawMaterial.DoesNotExist:
                            raise serializers.ValidationError(f"RawMaterial {raw_mat_id} does not exist")

                        total_required_quantity = required_quantity * product_quantity

                        if raw_material.quantity_available >= total_required_quantity:
                            raw_material.quantity_available -= total_required_quantity
                        else:
                            p_name = product_map[product_id].title
                            raise serializers.ValidationError(
                                f"{raw_material.name}: only {raw_material.quantity_available} in storage. "
                                f"{total_required_quantity} are required for {p_name}.")

                        raw_material.save()
            else:
                raise serializers.ValidationError("No products found.")
