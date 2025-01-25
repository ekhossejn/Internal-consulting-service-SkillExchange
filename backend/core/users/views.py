from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.

def PrintName(request):
    return JsonResponse("hello kate", safe=False)
