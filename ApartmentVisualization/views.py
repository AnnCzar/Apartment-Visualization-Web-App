from django.shortcuts import render

from ApartmentVisualization.models import Apartment_model, Rooms
from django.http import JsonResponse


def get_apartment_basic_info(request, model_name):
    try:
        apartment = Apartment_model.objects.get(name=model_name)
        data = {
            "area_sum": apartment.area_sum,
            "rooms_sum": apartment.rooms_sum,
            "floor": apartment.floor,
            "localisation": apartment.localisation,
            "price": apartment.price
        }
        return JsonResponse(data)
    except Apartment_model.DoesNotExist:
        return JsonResponse({"error": "Model not found"}, status=404)


def get_developer_info(request, model_name):
    try:
        apartment = Apartment_model.objects.get(name=model_name)
        data = {
            "developer_name": apartment.developer_name,
            "developer_email": apartment.developer_email
        }
        return JsonResponse(data)
    except Apartment_model.DoesNotExist:
        return JsonResponse({"error": "Model not found"}, status=404)


def get_rooms_for_model(request, model_name):
    try:
        apartment = Apartment_model.objects.get(name=model_name)
        rooms = Rooms.objects.filter(apartment_model=apartment)

        rooms_data = []
        for room in rooms:
            rooms_data.append({
                "name_room": room.name_room,
                "area": room.area
            })

        return JsonResponse({"rooms": rooms_data})
    except Apartment_model.DoesNotExist:
        return JsonResponse({"error": "Model not found"}, status=404)