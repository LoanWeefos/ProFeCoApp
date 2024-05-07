# ProFeCoApp
App de ProFeCo desarrollada para la clase de Arquiecturas Empresariales

# Código para montar los módulos:
```
npm install bcrypt@5.1.1 cookie-parser@1.4.6 cors@2.8.5 dotenv@16.4.5 express@4.19.2 joi@17.12.3 jsonwebtoken@9.0.2 keyv@4.5.4 morgan@1.10.0 mysql2@3.9.6 sequelize-cli@6.6.2 sequelize@6.37.3 winston@3.13.0
```

# Código para crear la base de datos:
```
npx sequelize db:create
npx sequelize db:migrate --name 20240421093316-create-usuario
npx sequelize db:migrate --name 20240421093320-create-consumidor
npx sequelize db:migrate --name 20240421093322-create-mercado
npx sequelize db:migrate --name 20240421093348-create-imagen
npx sequelize db:migrate --name 20240421093351-create-producto
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

Nota: resolución para dispostivos de hasta 1024x768px