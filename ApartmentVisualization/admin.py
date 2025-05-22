from django.contrib import admin

from django.contrib import admin
from .models import Apartment_model, Rooms

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