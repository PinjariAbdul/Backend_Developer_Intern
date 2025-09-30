from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    
    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        # If user is superuser, automatically set role to admin
        if self.is_superuser:
            self.role = 'admin'
        super().save(*args, **kwargs)