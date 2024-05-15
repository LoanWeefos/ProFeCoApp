# ProFeCoApp
App de ProFeCo desarrollada para la clase de Arquiecturas Empresariales

# -CONTENEDOR-
# Código para abrir el contenedor de ProFecoApp en Docker:
```
docker-compose up -d --build
```
Después solo basta con abrir el index.html o ejecutarlo a través de la extensión Live Server.
# CAMBIAR EL CONFIG.JSON PARA USAR LA BASE
```
{
  "development": {
    "username": "root",
    "password": "1234",
    "database": "profecoApp",
    "host": "host.docker.internal",
    "dialect": "mysql",
    "timezone": "-07:00"
  },
  "test": {
    "username": "root",
    "password": "1234",
    "database": "profecoApp",
    "host": "host.docker.internal",
    "dialect": "mysql",
    "timezone": "-07:00"
  },
  "production": {
    "username": "root",
    "password": "1234",
    "database": "profecoApp",
    "host": "host.docker.internal",
    "dialect": "mysql",
    "timezone": "-07:00"
  }
}

```

# NOTAS:
ESTE SERVICIO ESTA LIMITADO, PUES SOLO DE MANERA LOCAL SE PUEDE USAR EL SOCKET.IO,
ADEMÁS DEL CORRECTO RENDERIZADO DE LAS IMAGENES.


# -LOCAL-
# Código para montar los módulos:
```
npm install
```

# Código para crear la base de datos:
```
npx sequelize db:create
npx sequelize db:migrate --name 20240421093316-create-usuario
npx sequelize db:migrate --name 20240421093320-create-consumidor
npx sequelize db:migrate --name 20240421093322-create-mercado
npx sequelize db:migrate --name 20240421093351-create-producto
npx sequelize db:migrate --name 20240421093348-create-imagen
npx sequelize db:migrate --name 20240507071703-create-categoria
npx sequelize db:migrate --name 20240421093329-create-calificacion
npx sequelize db:migrate --name 20240421093332-create-reporte
npx sequelize db:migrate --name 20240421093335-create-lista-deseos
```
o ejecutar el .sql en la carpeta

Pasos para ejecutar:
1. Sobre la carpeta raíz del proyecto ".../ProFecoApp>" ejecutar:
    ```npm start```

2. Abrir el index.html o ejecutarlo a través de la extensión Live Server.
