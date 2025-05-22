from django.db import models

# Create your models here.

# modele: id, model nazwa, metraz suma, ilosc pokoi, pietro, lokalizacja, cena, deweloper, mail deweleopera
#
# pomieszczenia, id nazwa pomieszczeni, metraz, fk do tabeli z modelami
class Apartment_model(models.Model):
    name = models.CharField(max_length=100)
    area_sum = models.FloatField()
    rooms_sum = models.IntegerField()
    floor = models.IntegerField()
    localisation = models.CharField(max_length=100)
    price = models.FloatField()
    developer_name = models.CharField(max_length=100)
    developer_email = models.CharField(max_length=100)



class Rooms(models.Model):
    name_room = models.CharField(max_length=100)
    area = models.FloatField()
    apartment_model = models.ForeignKey(Apartment_model, on_delete=models.CASCADE)
