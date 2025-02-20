from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Recipe
from .serializers import CustomUserSerializer, RecipeSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['GET'])
def search(request):
    try:
        query = request.GET.get('q', '').strip()
        if query:
            recipes = Recipe.objects.filter(name__icontains=query)
            serializer = RecipeSerializer(recipes, many=True)
            return Response({'recipes': serializer.data, 'query': query},status=status.HTTP_200_OK)
        return Response({'error': 'Invalid query'},status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_signup(request):
    try:
        form = CustomUserSerializer(data=request.data)
        if form.is_valid():
            form.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

def get_tokens_for_user(user):
    try:
        token = RefreshToken.for_user(user)
        if token:
            return {
                'refresh': str(token),
                'access': str(token.access_token),
            }
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    try:
        email = request.data.get("email")
        password = request.data.get("password")

        print(email, password)

        if not email and not password:
            return Response({'error': 'Email and password are required'},status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(email=email, password=password)
        print(user)
        if user is not None:
            tokens = get_tokens_for_user(user)
            return Response({'message': 'User logged in successfully', 'tokens': tokens},status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'},status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_recipe(request):
    try:
        form = RecipeSerializer(data=request.data)
        if form.is_valid():
            recipe = form.save(commit=False)
            recipe.user = request.user
            recipe.save()
            return Response({'message': 'Recipe added successfully'}, status=status.HTTP_201_CREATED)
        return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_favorite(request, recipe_id):
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        if recipe in request.user.favorite_recipes.all():
            recipe.favorites.remove(request.user)
            return Response({'message': 'Recipe removed from favorites successfully'}, status=status.HTTP_400_BAD_REQUEST)
        recipe.favorites.add(request.user)
        return Response({'message': 'Recipe added to favorites successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_favorites(request):
    try:
        recipes = request.user.favorite_recipes.all()
        if not recipes:
            return Response({'message': 'No favorite recipes found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecipeSerializer(recipes, many=True)
        return Response({'recipes': serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
