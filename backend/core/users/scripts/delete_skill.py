import os
import sys
from django.core.wsgi import get_wsgi_application

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.dirname(BASE_DIR)
sys.path.append(PROJECT_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_wsgi_application()

from users.models import Skill

def delete_skill_by_name(name):
    try:
        skill = Skill.objects.get(name=name)
        skill.delete()
        print(f"Скилл с названием {name} и все связанные данные успешно удалены.")
    except skill.DoesNotExist:
        print(f"Скилл с названием {name} не найден.")

if __name__ == "__main__":
    print("Введите данные скилла для удаления из базы")
    
    name = input("Название скилла (name): ")
    
    delete_skill_by_name(name)