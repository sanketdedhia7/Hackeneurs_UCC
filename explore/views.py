from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from authen.models import *
from explore.models import *
from PIL import Image

# Create your views here.


def dashboard(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        return render(request, 'dashboard.html', {'profile': pr})
    else:
        return redirect('/authen/login/')

def dashboard_home(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        return render(request, 'dashboardNEW.html', {'profile': pr})
    else:
        return redirect('/authen/login/')

def crypto(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        data = Flyer.objects.all()
        return render(request, 'crypto.html', {'profile': pr, 'allflyers': data})
    else:
        return redirect('/authen/login/')

def convert(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        data = Flyer.objects.all()
        return render(request, 'convert.html', {'profile': pr, 'allflyers': data})
    else:
        return redirect('/authen/login/')

def will(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        data = Flyer.objects.all()
        return render(request, 'will.html', {'profile': pr, 'allflyers': data})
    else:
        return redirect('/authen/login/')

def willsubmit(request):
    if request.user.is_authenticated:
        username = request.POST['f1']
        print(username);
        pr=User.objects.get(username=username)
        #pr=Profile.objects.get(user=username);
        creator=Profile.objects.get(user=request.user);
        percentage=request.POST['f2'];
        fly = Flyer.objects.create(
             username=username, percentage=percentage, creater=creator)
        fly.save()

       # pr = Profile.objects.get(user=request.user)
       # data = Flyer.objects.all()
        return render(request, 'will.html', {'profile': creator})
    else:
        return redirect('/authen/login/')

def predict(request):
    if request.user.is_authenticated:
        pr = Profile.objects.get(user=request.user)
        data = Flyer.objects.all()
        return render(request, 'predict.html', {'profile': pr, 'allflyers': data})
    else:
        return redirect('/authen/login/')

def place(request, p):
    if request.user.is_authenticated:
        description = request.POST['description']
        cryptoname = request.POST['cryptoname']
        date = request.POST['date']
        time = request.POST['time']
        # Flyer.objects.all().delete()
        pr = Profile.objects.get(user=request.user)
        fly = Flyer.objects.create(
             description=description, cryptoname=cryptoname, creater=pr,date=date,time=time)
        fly.save()
        print("kjgjg", request.FILES)
        a = request.FILES


         # return render(request, 'dashboard.html',{'allflyers':data})
        return redirect('/dashboard/home/')
    else:
        return redirect('/authen/login/')


def location(request,p):
     data = Flyer.objects.get(title=p) 
     print(data)
     data.viewcount=data.viewcount+1
     data.save()
     pr = Profile.objects.get(user=request.user)
     print(photos)
     return render(request, 'location.html',{'profile': pr,'flyer':data})
