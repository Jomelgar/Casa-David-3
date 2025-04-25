# Deploy a Heroku

1. Buildear el frontend
2. Configurar las ENV keys (las credenciales a usar son las de heroku)
3. Asegurarse que tanto el .env y la carpeta build del frontend no estan en el .gitignore del repo de heroku.

Se utilizo el heroku-cli para subir el source a Heroku.
Clonear en una carpeta aparte el repo que esta en el server y solo hay que copiar todos los contenidos de este repo al repo de heroku.

Seguir los pasos de la documentacion de Heroku si se quiere cargar un dump a la base de datos (es probable que se tenga que reiniciar la base de datos asi que hacer respaldos antes de realizar eso.)

Verificar que las tablas y vistas se hayan creado correctamente. Si las vistas no estan creadas, conectarse a la DB y ejecutar `createViewsScript.sql`