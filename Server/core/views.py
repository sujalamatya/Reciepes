from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Recipe, CustomUser
from .serializers import CustomUserSerializer, RecipeSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['GET'])
def search(request):
    query = request.GET.get('q', '').strip()
    if query:
        recipes = Recipe.objects.filter(name__icontains=query)
        serializer = RecipeSerializer(recipes, many=True)
        return Response({'recipes': serializer.data, 'query': query},status=status.HTTP_200_OK)
    return Response({'error': 'Invalid query'},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_signup(request):
    form = CustomUserSerializer(data=request.data)
    if form.is_valid():
        form.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)

def get_tokens_for_user(user):
    token = RefreshToken.for_user(user)
    if token:
        return {
            'refresh': str(token),
            'access': str(token.access_token),
        }

@api_view(['POST'])
def user_login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email and not password:
        return Response({'error': 'Email and password are required'},status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(email=email, password=password)
    if user is not None:
        tokens = get_tokens_for_user(user)
        return Response({'message': 'User logged in successfully', 'tokens': tokens},status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'},status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_recipe(request):
    form = RecipeSerializer(data=request.data)
    if form.is_valid():
        recipe = form.save(commit=False)
        recipe.user = request.user
        recipe.save()
        return Response({'message': 'Recipe added successfully'}, status=status.HTTP_201_CREATED)
    return Response({'errors': form.errors}, status=status.HTTP_400_BAD_REQUEST)
