from django.shortcuts import render

from ApartmentVisualization.models import Apartment_model


# Create your views here.
def get_model_info(model_name):
    my_model = Apartment_model.object.filter(name=model_name).first()