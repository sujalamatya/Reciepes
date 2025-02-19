from rest_framework.serializers import ModelSerializer
from .models import Recipe, CustomUser


class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class RecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'
