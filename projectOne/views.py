from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, user_logged_in, user_logged_out
from django.contrib import messages

def login_user(req):

    if req.user.is_authenticated:
        return redirect('menu/')
    else:
        if req.method == "POST":
           user_name= req.POST['username']
           user_password= req.POST['password'] 
           user= authenticate(req, username= user_name,password= user_password)   
           if user is not None:
               user_details= login(req,user)
            #    req.session['user_log']=True
            #    req.session[]
               return redirect('menu/')
           else:
               messages.success(req,"There was an error logging in! please try again later ....")
               return redirect('/') 
    return render(req,"login.html",{})

