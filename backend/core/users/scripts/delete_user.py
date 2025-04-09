import os
import sys
from django.core.wsgi import get_wsgi_application

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.dirname(BASE_DIR)
sys.path.append(PROJECT_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_wsgi_application()

from authentication.models import CustomUser

def delete_user_by_email(email):
    try:
        user = CustomUser.objects.get(email=email)
        user.delete()
        print(f"Пользователь с почтой {email} и все связанные данные успешно удалены (кроме статических файлов с сервера).")
    except CustomUser.DoesNotExist:
        print(f"Пользователь с почтой {email} не найден.")

if __name__ == "__main__":
    print("Введите данные пользователя для удаления из базы")
    
    email = input("Почта (email): ")
    
    delete_user_by_email(email)