from django.db import models
from menu.models import Products

# Create your models here.
class Cart(models.Model):
    cart_id= models.AutoField(primary_key=True)
    user_id= models.IntegerField()
    cart_status= models.CharField(max_length=100)

class Cart_Products(models.Model):
    cart_product_id= models.AutoField(primary_key=True,blank=False)
    cart_id= models.ForeignKey(Cart,on_delete=models.CASCADE)
    product_id= models.ForeignKey(Products,on_delete=models.CASCADE)
    quantity= models.IntegerField()
    price= models.CharField(max_length=100)



