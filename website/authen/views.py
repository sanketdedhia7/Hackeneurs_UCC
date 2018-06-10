# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from .models import Profile
import hashlib
import datetime
import smtplib

from explore.models import *

# Create your views here.


def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirmpassword = request.POST['confirmpassword']
        photo = request.FILES.get('photo')
        bio = request.POST['bio']
        print("photo", photo)
        if password == confirmpassword:
            user = User.objects.create(username=username)
            user.set_password(request.POST['password'])

            user.save()
        else:
            print('Passwords do not match')
            user = None
        print(user)
        if user is not None:
            hash = hashlib.sha1()
            temp = email + 'hahaha'
            hash.update(temp.encode('utf-8'))
            tp = hash.hexdigest()
            print(tp)
            user_profile = Profile.objects.create(
                user=user, email=email, bio=bio, profile_pic=photo, confirmhash=tp)
            print(user_profile)
            return HttpResponseRedirect('/authen/login/')
        else:
            return HttpResponse('Some Probem occured')
    else:
        if request.user.is_authenticated:
            return HttpResponseRedirect('/dashboard')
        else:
            return render(request, 'signup.html', {"profile": None})


def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return HttpResponseRedirect('/home/')
        else:
            return HttpResponse('You havent registered')
    else:
        if request.user.is_authenticated:
            return HttpResponseRedirect('/home/')
        else:
            return render(request, 'login.html', {"profile": None})


def logout(request):
    if request.user.is_authenticated:
        auth_logout(request)
        return redirect('/authen/login/')
    else:
        return redirect('/authen/login/')


def forgotpassword(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        print(email)
        user_profile = Profile.objects.get(email=email)
        if user_profile is not None:

            hash = hashlib.sha1()
            temp = email + 'hahaha'
            hash.update(temp.encode('utf-8'))
            tp = hash.hexdigest()
            print(tp)
            domain = request.get_host()
            scheme = request.is_secure() and "https" or "http"
            TO = email
            SUBJECT = 'TEST MAIL'
            TEXT = "Please Click On The Link To complete registration: {0}://{1}/authen/{2}/resetpassword".format(
                scheme, domain, tp)

            # Gmail Sign In
            gmail_sender = "*"
            gmail_passwd = "*"

            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.ehlo()
            server.starttls()
            server.login(gmail_sender, gmail_passwd)

            BODY = '\r\n'.join(['To: %s' % TO,
                                'From: %s' % gmail_sender,
                                'Subject: %s' % SUBJECT,
                                '', TEXT])

            try:
                server.sendmail(gmail_sender, [TO], BODY)
                print('email sent')
            except:
                print('error sending mail')

            server.quit()

            return HttpResponse('Check your mailbox')

        else:
            return HttpResponse('Email is not registered')

    else:
        if request.user.is_authenticated():
            return HttpResponseRedirect('/dashboard')
        else:
            return render(request, 'forgotpass.html', {"profile": None})


def resetpassword(request, p):
    # print(p)
    # up = Profile.objects.get(confirmhash = p)
    # print(up)
    # return HttpResponse(up)
    if request.method == 'POST':
        print(p)
        upass = request.POST.get('upass')
        upass1 = request.POST.get('upass1')
        print(upass, upass1)
        if upass == upass1:
            up = Profile.objects.get(confirmhash=p)
            print("user", up.user)
            user = up.user
            a = user.set_password(upass)
            print(a)
            user.save()
            print('hhhhhhh')
            return redirect('/authen/login/')

        else:
            return HttpResponse('Enter password correctly')

    else:
        up = Profile.objects.get(confirmhash=p)
        print(up)
        return render(request, 'resetpass.html', {'user': up, "profile": None})


def viewprofile(request, p=None):
    if request.user.is_authenticated:
        if p is not None:
            user = User.objects.get(username=p)
            pr = Profile.objects.get(user=user)
        else:
            pr = Profile.objects.get(user=request.user)
        fly = Flyer.objects.filter(creater=pr)
        
        return render(request, 'profile.html', {"profile": pr, "flyers": fly})
    else:
        return redirect('/authen/login/')

def topics(request, p=None):
    if request.user.is_authenticated:
        if p is not None:
            user = User.objects.get(username=p)
            pr = Profile.objects.get(user=user)
        else:
            pr = Profile.objects.get(user=request.user)
        fly = Flyer.objects.filter(creater=pr)
        
        return render(request, 'topics.html', {"profile": pr, "flyers": fly})
    else:
        return redirect('/authen/login/')


def myaccount(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        if request.method == 'POST':
            username = request.POST.get('username')
            email = request.POST.get('email')
            bio = request.POST.get('bio')
            photo = request.FILES.get('photo')
            print(photo)
            user = request.user
            user.username = username
            hash = hashlib.sha1()
            temp = email + 'hahaha'
            hash.update(temp.encode('utf-8'))
            tp = hash.hexdigest()
            print(tp)
            try:
                user.save()
                # pr.update(email=email,bio = bio,profile_pic = photo,confirmhash = tp)
                pr.email = email
                pr.bio = bio
                if photo is not None:
                    pr.profile_pic = photo
                pr.confirmhash =  tp
                pr.save(update_fields = ["email","bio","profile_pic","confirmhash"])
            except:
                return HttpResponse('error')

        return render(request, 'account.html', {"profile": pr })
    else:
        return redirect('/authen/login/')





def buy(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        if request.method == 'POST':
            username = request.POST.get('username')
            email = request.POST.get('email')
            bio = request.POST.get('bio')
            photo = request.FILES.get('photo')
            description = request.POST['description']
            cryptoname = request.POST['cryptoname']
            if cryptoname=='BTC':
                pr.description1=pr.description1+int(description);
            if cryptoname=='ETC':
                pr.description2=pr.description2+int(description);
            if cryptoname=='DGTC':
                pr.description3=pr.description3+int(description);
            

            print(pr.description1);
            print(pr.description2);
            print(pr.description3);
            
            pr.save()
                # pr.update(email=email,bio = bio,profile_pic = photo,confirmhash = tp)
                #pr.email = email
                #pr.bio = bio
                #if photo is not None:
                 #   pr.profile_pic = photo
                
            

        return render(request, 'dashboardNEW.html', {"profile": pr })
    else:
        return redirect('/authen/login/')
