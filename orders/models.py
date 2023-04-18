from django.db import models
from cart.models import Cart

# Create your models here.
class order(models.Model):
    order_id= models.AutoField(primary_key=True)
    cart_id= models.ForeignKey(Cart,on_delete=models.CASCADE)
    user_id= models.IntegerField()
    order_total= models.CharField(max_length=200)
    
