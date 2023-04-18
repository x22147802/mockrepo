from django.shortcuts import render, redirect, HttpResponse
from .models import Cart, Cart_Products
from orders.models import order
from menu.models import Products
from django.http import JsonResponse

# Create your views here.
def display_cart(req):
  if not req.user.is_authenticated:
    return redirect('/')
    
  userId= req.user.id
  totalOrderPrice=0
  cartId=0
  cartProducts=  Cart.objects.raw("SELECT cart_cart.cart_id, cart_cart_products.cart_product_id, cart_cart_products.quantity, ROUND((cart_cart_products.quantity * cart_cart_products.price),2) AS total_price, cart_cart_products.price, cart_cart_products.cart_product_id, menu_products.product_id, menu_products.product_name, menu_products.product_image FROM CART_CART JOIN cart_cart_products ON cart_cart_products.cart_id_id = cart_cart.cart_id JOIN menu_products ON menu_products.product_id = cart_cart_products.product_id_id WHERE cart_cart.cart_status='in_process' AND cart_cart.user_id=%s",[userId])
  totalOrderPrice=0
  
  if cartProducts:
    for products in cartProducts:
     totalOrderPrice= totalOrderPrice + float(products.total_price)
     cartId= products.cart_id

  return render(req,'cart.html',{'cartItems': cartProducts,'orderPrice':totalOrderPrice,'cart_id':cartId})

def ajax_inc_qty(req):
  cartProductId= req.POST['p_id']
  success= True

  # fetch the existing quantity and increase qty by one
  cardProductDetails= Cart_Products.objects.get(cart_product_id= cartProductId)
  existingQty= cardProductDetails.quantity
  newQty= int(existingQty) + 1

  # update the quantity
  Cart_Products.objects.filter(cart_product_id= cartProductId).update(quantity=newQty)

  return JsonResponse({'success':success,'message':'Successful','refresh_page':'Yes'})

def ajax_dec_qty(req):
  cartProductId= req.POST['p_id']
  success= True

  # fetch the existing quantity and increase qty by one
  cardProductDetails= Cart_Products.objects.get(cart_product_id= cartProductId)
  existingQty= cardProductDetails.quantity
  newQty= int(existingQty) - 1

  # update the quantity
  Cart_Products.objects.filter(cart_product_id= cartProductId).update(quantity=newQty)
  return JsonResponse({'success':success,'message':'Successful','refresh_page':'Yes'})

def ajax_rm_cart_prod(req):
  cartProductId= req.POST['p_id']
  success= True
  # update the quantity
  Cart_Products.objects.filter(cart_product_id= cartProductId).delete()

  return JsonResponse({'success':success,'message':'Successful','refresh_page':'Yes'})

def ajax_order_cart_products(req):
  totalPrice= req.POST['tP']
  cartId= req.POST['cId']
  userId= req.user.id
  success= True

  # update cart table
  Cart.objects.filter(cart_id=cartId,cart_status="in_process").update(cart_status="ordered")

  # insert data in to orders
  placeOrder= order(user_id=userId, order_total=totalPrice, cart_id_id= cartId)
  placeOrder.save()

  return JsonResponse({'success':success,'message':'Order placed successfully!','redirect_url':'/orders'})