from django.contrib import admin

from django.contrib import admin
from .models import Apartment_model, Rooms

# # Rejestracja modelu Apartment_model
# @admin.register(Apartment_model)
# class ApartmentModelAdmin(admin.ModelAdmin):
#     list_display = ('name', 'area_sum', 'rooms_sum', 'floor', 'localisation', 'price', 'developer_name', 'developer_email')
#     list_filter = ('floor', 'localisation', 'developer_name')
#     search_fields = ('name', 'localisation', 'developer_name', 'developer_email')
#     ordering = ('name',)
#
# # Rejestracja modelu Rooms z możliwością edycji w ramach Apartment_model
# @admin.register(Rooms)
# class RoomsAdmin(admin.ModelAdmin):
#     list_display = ('name_room', 'area', 'apartment_model')
#     list_filter = ('apartment_model',)
#     search_fields = ('name_room',)
#     ordering = ('name_room',)
#
# # Dodanie możliwości edycji pomieszczeń (Rooms) bezpośrednio w widoku Apartment_model
# class RoomsInline(admin.TabularInline):
#     model = Rooms
#     extra = 1  # Domyślna liczba pustych pól do dodania nowych pomieszczeń
#
# @admin.register(Apartment_model)
# class ApartmentModelAdmin(admin.ModelAdmin):
#     list_display = ('name', 'area_sum', 'rooms_sum', 'floor', 'localisation', 'price', 'developer_name', 'developer_email')
#     list_filter = ('floor', 'localisation', 'developer_name')
#     search_fields = ('name', 'localisation', 'developer_name', 'developer_email')
#     ordering = ('name',)
#     inlines = [RoomsInline]  # Dodanie inline edycji pomieszczeń
# admin.site.register(Apartment_model)
# admin.site.register(Rooms)

class RoomsInline(admin.TabularInline):
    model = Rooms
    extra = 1

@admin.register(Apartment_model)
class ApartmentModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'area_sum', 'rooms_sum', 'floor', 'localisation', 'price', 'developer_name')
    list_filter = ('floor', 'localisation', 'developer_name')
    search_fields = ('name', 'localisation', 'developer_name')
    inlines = [RoomsInline]

@admin.register(Rooms)
class RoomsAdmin(admin.ModelAdmin):
    list_display = ('name_room', 'area', 'apartment_model')
    list_filter = ('apartment_model',)
    search_fields = ('name_room',)