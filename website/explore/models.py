from django.db import models
from authen.models import Profile


# Create your models here.
class Flyer(models.Model):
    creater = models.ForeignKey(Profile, on_delete=models.CASCADE)
    owner=models.CharField(max_length=500)
    username=models.CharField(max_length=500)
    percentage = models.IntegerField(default=0)
    viewcount = models.IntegerField(default=0)
    def __str__(self):
      return self.creater.user.username+" "+self.username;

    

