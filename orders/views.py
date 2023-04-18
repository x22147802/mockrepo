from django.shortcuts import render, redirect, HttpResponse
from .models import *
from django.template.loader import render_to_string
from django.http import JsonResponse


# Create your views here.
def display_orders(req):
    userId= req.user.id
    # get all orders
    ordersList= order.objects.filter(user_id=userId)

    return render(req,'orders.html',{'orders_list': ordersList})

def ajax_get_cart_products(req):
    cartId= req.POST['c_id']
    orderId= req.POST['o_id']

    # get all cart products
    cartProducts=  Cart.objects.raw("SELECT cart_cart.cart_id, cart_cart_products.cart_product_id, cart_cart_products.quantity, menu_products.product_name FROM CART_CART JOIN cart_cart_products ON cart_cart_products.cart_id_id = cart_cart.cart_id JOIN menu_products ON menu_products.product_id = cart_cart_products.product_id_id WHERE cart_cart.cart_id=%s",[cartId])
    rendered= render_to_string('orders_template.html',{'products': cartProducts})

    return JsonResponse({'success':True,'message':'Successful','output':rendered,'order_id':orderId})

   

 


