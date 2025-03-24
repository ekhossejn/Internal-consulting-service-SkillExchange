import psycopg2
from decouple import config
def add_skill(name):
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
        INSERT INTO users_skill (name)
        VALUES (%s);
        """

        cursor.execute(insert_query, (name,))
        conn.commit()
        print(f"Скилл с названием {name} успешно добавлен.")
    except psycopg2.Error as e:
        print(f"Организай с названием {name} НЕ был добавлен.\nОшибка при работе с базой данных: ", e)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Введите данные скилла для добавления в базу")
    name = input("Название скилла (name): ")

    add_skill(name)