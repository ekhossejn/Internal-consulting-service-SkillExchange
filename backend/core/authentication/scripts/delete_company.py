import os
import sys
from django.core.wsgi import get_wsgi_application

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.dirname(BASE_DIR)
sys.path.append(PROJECT_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_wsgi_application()

from users.models import Company

def delete_company_by_domain(domain):
    try:
        company = Company.objects.get(domain=domain)
        company.delete()
        print(f"Организация с доменом {domain} и все связанные данные успешно удалены.")
    except Company.DoesNotExist:
        print(f"Организация с доменом {domain} не найдена.")

if __name__ == "__main__":
    print("Введите данные организации для удаления из базы")
    
    domain = input("Домен организации (domain): ")
    
    delete_company_by_domain(domain)