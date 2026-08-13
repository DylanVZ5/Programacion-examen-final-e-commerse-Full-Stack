import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

# Cargar variables de entorno desde el archivo .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("No se encontró la variable MONGO_URI en el archivo .env")

# Conexión a MongoDB
client = MongoClient(MONGO_URI)
# Obtiene la base de datos especificada en la URI (o la predeterminada)
db = client.get_database()

now = datetime.now(timezone.utc)

def seed_database():
    print("Iniciando inserción de datos de prueba...")

    # 1. Categorías
    categories_col = db["categories"]
    cat_tech = categories_col.insert_one({
        "nombre": "Electrónica",
        "createdAt": now,
        "updatedAt": now
    })
    cat_home = categories_col.insert_one({
        "nombre": "Hogar",
        "createdAt": now,
        "updatedAt": now
    })
    print("✔ Categorías creadas")

    # 2. Usuarios
    users_col = db["users"]
    user_admin = users_col.insert_one({
        "nombre": "Admin General",
        "email": "admin@example.com",
        "password": "hashed_password_aqui",  # Recuerda usar hash en producción
        "rol": "admin",
        "createdAt": now,
        "updatedAt": now
    })
    user_client = users_col.insert_one({
        "nombre": "Juan Pérez",
        "email": "juan@example.com",
        "password": "hashed_password_aqui",
        "rol": "user",
        "createdAt": now,
        "updatedAt": now
    })
    print("✔ Usuarios creados")

    # 3. Productos
    products_col = db["products"]
    prod_laptop = products_col.insert_one({
        "nombre": "Laptop Gamer",
        "precio": 1200.00,
        "stock": 10,
        "categoria": cat_tech.inserted_id,
        "createdAt": now,
        "updatedAt": now
    })
    prod_mouse = products_col.insert_one({
        "nombre": "Mouse Inalámbrico",
        "precio": 25.50,
        "stock": 50,
        "categoria": cat_tech.inserted_id,
        "createdAt": now,
        "updatedAt": now
    })
    print("✔ Productos creados")

    # 4. Carrito
    carts_col = db["carts"]
    carts_col.insert_one({
        "usuario": user_client.inserted_id,
        "productos": [
            {
                "producto": prod_mouse.inserted_id,
                "cantidad": 2
            }
        ],
        "createdAt": now,
        "updatedAt": now
    })
    print("✔ Carrito creado")

    # 5. Pedidos (Order)
    orders_col = db["orders"]
    order_1 = orders_col.insert_one({
        "usuario": user_client.inserted_id,
        "total": 1200.00,
        "estado": "completado",
        "createdAt": now,
        "updatedAt": now
    })
    print("✔ Pedido creado")

    # 6. Pagos
    payments_col = db["payments"]
    payments_col.insert_one({
        "metodo": "tarjeta",
        "estado": "exitoso",
        "pedido": order_1.inserted_id,
        "createdAt": now,
        "updatedAt": now
    })
    print("✔ Pago creado")

    # 7. Reseñas (Reviews)
    reviews_col = db["reviews"]
    reviews_col.insert_one({
        "producto": prod_laptop.inserted_id,
        "comentario": "Excelente rendimiento para desarrollo y juegos.",
        "usuario": user_client.inserted_id,
        "createdAt": now,
        "updatedAt": now
    })
    print("✔ Reseña creada")

    print("\n¡Proceso de carga completado con éxito!")

if __name__ == "__main__":
    try:
        seed_database()
    except Exception as e:
        print(f"Error al poblar la base de datos: {e}")
    finally:
        client.close()