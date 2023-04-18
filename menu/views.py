from django.shortcuts import render, redirect, HttpResponse
from .models import Products
from cart.models import Cart, Cart_Products
from django.http import JsonResponse


# Create your views here.
def display_menu(req,categoryParam=''):

    if not req.user.is_authenticated:
      return redirect('/')
    
    if categoryParam == "":
      return redirect('category/starters')
    else:
      categoryParam= categoryParam.capitalize()

    products= Products.objects.filter(product_category=categoryParam)
    return render(req,'menu.html',{
      "menu_products": products,
      "active_cat":categoryParam,
    })


def build_cart_products(req):
   productIdPosted= req.POST['p_id']
   products= Products.objects.get(product_id=productIdPosted)
   success= True

   return JsonResponse({'success': success ,'product_id':products.product_id, 'product_name':products.product_name, 'product_price': products.product_price})

def add_to_cart(req):

   userId= req.user.id
   productPrice= req.POST['c_p']
   productId= req.POST['p_id']
   qty= req.POST['quant']
   success=True

   # check if the user has pending cart
   cart_details= Cart.objects.filter(user_id=userId,cart_status="in_process")
   if cart_details.exists() == False:
      # create cart for the user
      createCart= Cart(user_id=userId, cart_status="in_process")
      createCart.save()
      cartId= Cart.objects.latest('cart_id')
      cartId=cartId.cart_id
      
      # insert cart products
      insertCartProducts= Cart_Products(cart_id_id= cartId, product_id_id= productId, quantity= int(qty), price= productPrice)
      insertCartProducts.save()

   else:
      for cart in cart_details:
        cartId= cart.cart_id

      #check for existing cart products
      existingCartProducts= Cart_Products.objects.filter(cart_id= cartId, product_id_id= productId)
      # if exists update quantity else insert new product   
      if existingCartProducts.exists() == False:
         # insert cart products
         insertCartProducts= Cart_Products(cart_id_id= cartId, product_id_id= productId, quantity=int(qty), price= productPrice)
         insertCartProducts.save()
      else:
         existingQty= 0
         for existingCartProd in existingCartProducts:
            existingQty= existingCartProd.quantity
         newQty= int(existingQty) + int(qty)

         Cart_Products.objects.filter(cart_id_id= cartId, product_id_id= productId).update(quantity=newQty)

   return JsonResponse({'success':success,'message':'Successful'})







