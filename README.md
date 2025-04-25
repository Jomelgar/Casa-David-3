# Casa David App
> Aplicacion web que brinda una mejor administraccion para la fundacion [Casa David](https://casadavid.org/)

<br/>
Proyecto desarrollado por estudiantes durante la clase de EXPERIENCIA DE USUARIO del Q2 del 2024
<br/>
UNITEC - SPS
<br/>
<br/>

👨🏻‍🏫 Junto al Ing. [Erick Amaya](https://github.com/Dann-er)

![WhatsApp Image 2024-06-24 at 18 18 18_71e80cc9](https://github.com/LiaF21/UX_Backend/assets/169367790/a85db3b1-8456-4bd2-b7fe-db42cf162438)


## Estado Actual 🎯

La aplicacion se encuentra alojada en Heroku, la cual dejara de funcionar el 31/julio/2024.
Asi mismo la instancia de EC2 en aws, la cual contiene la base de datos.

## Quickstart para desarrollo
> [!IMPORTANT]
> Valido desde v1.1 (Experiencia de Usuario Q4 2024)

Previo a clonar el repositorio, asegurarse de tener docker instalado.

Luego con el repo clonado, pedirle a uno de los colaboradores el archivo `.env` que contiene las variables de entorno necesarias y ponerlo en la raiz del proyecto.

Luego levantar los contenedores con `docker-compose`
```bash
# Levantar los contenedores
$ docker compose up

# Guia de ports
# 3000 -> Frontend
# 3001 -> Backend
# 8080 -> postgres
#    Dentro del contenedor postgres esta asignado al puerto 5432, pero para conectarse al contenedor desde el host se usa el puerto 8080
```

Para el desarrollo del frontend, se puede acceder a `http://localhost:3000` y para el backend `http://localhost:3001`

- Las dependencias de front se encuentran en `./client`
- Las dependencias de back se encuentran en la raiz del proyecto.

## Funcionamiento del Desarrollo

### Base De Datos

Utilizamos una instancia de EC2 en AWS dentro de la cual instalamos postgress, despues
habilitamos los puertos necesarios para que cualquier de los que estabamos desarrollando
pudieran conectarse a la db. Asi tambien la aplicacion.

Desde el archivo .env dentro de la carpeta server, pueden cambiar los parametros
para que asi puedan conectarse a su propia db.

> El archivo para clonar la base de datos que usamos durante el desarrollo se encuentra
> dentro de ./server/casaDavid.sql


<br/>

### Backend

🗄️ Usamos **sequelize**  para poder manipular la base de datos (ORM)


🛡️ Ya esta implementado el jsonwebtoken dentro de la aplicacion, esto lo requieren todas las paginas de la aplicacion
y los servicios, excepto el login (/auth/) y el servicio para loggearse (/api/auth/login).

🗺️ Todas las rutas que utilizan los servicios para manipular o acceder a la base de datos se anteceden de ***/api/routes.....***
Esto ultimo para distinguir luego entro las peticiones de las vistas como tal y las peticiones que se hacen dentro de 
estas vistas como getReservacion().

>[!NOTE]
> El middleware que valida el token sobre aquellas peticiones que se hacen al servidor, excluye todas aquellas
> que no contiene ***../api/..*** ademas del servicio para poder loggearse "/api/auth/login"

> [!TIP]
> Excluye aquellas rutas que no contienen "/api/" porque a la hora de usar los archivos estaticos que se
> generan del *build* no sea necesario mandarle el token al servidor (si tiene el token se valida en el frontend).

<br/>

### Frontend
Utilizamos una libreria de componentes llamada [AntDesign](https://ant.design/)
> Que si no saben mucho de html y css, les facilitara muchooooo trabajo

📍 Usamos tambien tailwinds en muchos casos

📍 El Token se guarda como una cookie

📍En el archivo *app.js" podran notar un componente ***ProtectedRoute***, este componente es el encargado de hacer las repetivas
  validaciones sobre quien puede acceder a las paginas de la aplicacion, dentro de la rama principal valida primero, si en la
  seccion actual existe el token en la cookie.
  Despues ramifica para cada seccion de la aplicacion, validando los privilegios del usuario logeado (que se encuentran dentro del token). El componente recibe el booleano para
  mostrar la pagina despues de hacer las validaciones sobre los privilegios que requiere.



***IMPORTANTE***
<br/>
Dentro de ./client/src/ encuentra un archivo config.js el cual contiene el port que utilizan para acceder a la API, esto se define el servidor comunmente se usamos el 3001, 
a su vez se encuentra URL_HOSTING, que guarda la url donde se encuentra alojada la aplicacion esto, si en dado caso aplica.

Dentro de ./client/src/api se encuentra axiosinstance.js que contiene la instancia que usamos para llamar a los servicios del backend, notaran que aqui seteamos el token
si aplica, y ademas captura un error de status 403, que significa que el token es invalido por lo tanto debera logearse.

Pero lo importante aqui es la propiedad **baseUrl** de la instancia de axios, notaran que si esta en produccion (esto lo puede setear el servicio de hosting o manualmente se puede tambien)
usara la url que seteamos en config.js, y si no usara el puerto que definamos en el config.js.

