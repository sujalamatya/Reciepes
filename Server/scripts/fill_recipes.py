from core.models import Recipe, CustomUser
import requests
from django.core.files.base import ContentFile
import os

def run():
    res = requests.get('https://dummyjson.com/recipes')
    recipes = res.json()

    if recipes:
        for data in recipes['recipes']:
            name = data.get('name')
            cuisine = data.get('cuisine')
            difficulty = data.get('difficulty')
            rating = data.get('rating')
            ingredients = data.get('ingredients')
            instructions = data.get('instructions')
            image_url = data.get('image')

            image_name = None 

            if image_url:
                try:
                    image_response = requests.get(image_url)
                    if image_response.status_code == 200:
                        image_name = os.path.basename(image_url)
                        image_file = ContentFile(image_response.content, name=image_name)
                    else:
                        print(f"Failed to download image: {image_url} (Status code: {image_response.status_code})")
                except Exception as e:
                    print(f"Error downloading image: {e}")

            recipe = Recipe(
                name=name,
                cuisine=cuisine,
                difficulty=difficulty,
                rating=rating,
                ingredients=ingredients,
                instructions=instructions,
                user=CustomUser.objects.first(), 
            )

            if image_name:
                recipe.image.save(image_name, image_file)  

            recipe.save()  
