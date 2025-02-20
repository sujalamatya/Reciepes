from django.urls import path
from .views import search, user_login, user_signup, add_recipe, add_favorite, get_favorites

urlpatterns = [
    path('recipes/search/', search, name="search"),
    path('login/', user_login, name="login"),
    path('signup/', user_signup, name="signup"),
    path('recipes/create/', add_recipe, name="add_recipe"),
    path('recipes/favorite/<int:recipe_id>/', add_favorite, name="add_favorite"),
    path('recipes/favorites/', get_favorites, name="get_favorites"),
]
