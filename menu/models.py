from django.db import models

# Create your models here.
class Products(models.Model):
    product_id= models.AutoField(primary_key=True,blank=False)
    product_name= models.CharField(max_length=500)
    product_price= models.CharField(max_length=100)
    product_image= models.FileField(upload_to='images/')
    product_category= models.CharField(max_length=100)
