from django.urls import path
from .views import search, user_login, user_signup, add_recipe

urlpatterns = [
    path('recipes/search/', search, name="search"),
    path('login/', user_login, name="login"),
    path('signup/', user_signup, name="signup"),
    path('recipes/create/', add_recipe, name="add_recipe"),
]
