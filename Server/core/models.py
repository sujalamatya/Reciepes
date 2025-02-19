from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

class CustomUser(AbstractUser):
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    REQUIRED_FIELDS = ['username']
    USERNAME_FIELD = 'email'

    def __str__(self):
        return f'{self.username}'

class Recipe(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'Easy', 'Easy'
        MEDIUM = 'Medium', 'Medium'
        HARD = 'Hard', 'Hard'

    name = models.CharField(max_length=255)
    cuisine = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=255, choices=Difficulty.choices, default=Difficulty.EASY)
    rating = models.DecimalField(max_digits=2, decimal_places=1, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    ingredients = models.TextField()
    instructions = models.TextField()
    image = models.ImageField(upload_to='recipe_images/', null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name}'

