from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from users.models import Company

def get_default_company():
    # TODO: специальная для superuser
    return Company.objects.get(id=1)

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('User must have email')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('company', get_default_company())
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg', upload_to='avatars')
    name = models.CharField(max_length=20, null=True)
    rating_sum = models.IntegerField(default=0)
    rating_count = models.IntegerField(default=0)
    skills = models.ManyToManyField('users.Skill', related_name='users', blank=True)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False) 

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Значения для createsuperuser()

    def __str__(self):
        return self.email

    def __getattribute__(self, name):
        attr = models.Model.__getattribute__(self, name)
        if name == 'name' and not attr:
            return f'{self.email.split("@")[0][:20]}'
        return attr
