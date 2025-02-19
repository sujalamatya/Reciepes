from django.contrib import admin
from .models import Recipe, CustomUser

class RecipeAdmin(admin.ModelAdmin):
    list_display = ('name', 'cuisine', 'difficulty', 'rating')

admin.site.register(Recipe, RecipeAdmin)
admin.site.register(CustomUser)
