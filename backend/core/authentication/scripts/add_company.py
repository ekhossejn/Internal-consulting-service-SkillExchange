import psycopg2
from decouple import config
def add_company(domain, name, description):
    connection_params = {
        "host": config("DB_HOST"),
        "port": config("DB_PORT"),
        "dbname": config("DB_NAME"),
        "user": config("DB_USER"),
        "password": config("DB_PASSWORD"),
        "sslmode": config("DB_SSLMODE"),
        "target_session_attrs": config("DB_TARGET_SESSION_ATTRS")
    }

    try:
        conn = psycopg2.connect(**connection_params)
        cursor = conn.cursor()

        insert_query = """
        INSERT INTO users_company (domain, name, description)
        VALUES (%s, %s, %s);
        """

        cursor.execute(insert_query, (domain, name, description))
        conn.commit()
        print(f"Организация с доменом {domain} успешно добавлена.")
    except psycopg2.Error as e:
        print(f"Организай с доменом {domain} НЕ была добавлена.\nОшибка при работе с базой данных: ", e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Введите данные организации для добавления в базу")
    
    domain = input("Домен организации (domain): ")
    name = input("Название организации (name): ")
    description = input("Описание организации (description): ")
    
    add_company(domain, name, description)