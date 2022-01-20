from django.db import models
import string
import random


# Generate a unique code -> Kind of inefficient
def generate_unique_code():
    length = 6
    
    while True:
        # Generate a random code
        code = ''.join(random.choices(string.ascii_uppercase, k=length))

        # Iterate through the data base and if the random code does not exist, break
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

# Create your models here.
# For more models examples look at the django documentation
class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    # 
    # def is_host_this(host) -> an example of how you can add functions to models