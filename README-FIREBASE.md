# Configuración de Firebase Authentication

Este proyecto utiliza Firebase Authentication para el manejo de usuarios. Sigue estos pasos para configurarlo correctamente:

## Paso 1: Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Añadir proyecto"
3. Sigue los pasos para crear un nuevo proyecto
4. Una vez creado, ve a "Authentication" en el menú lateral
5. Haz clic en "Comenzar" y habilita el proveedor de "Correo electrónico/contraseña"

## Paso 2: Obtener las credenciales de tu proyecto

1. En la consola de Firebase, ve a la configuración del proyecto (ícono de engranaje)
2. Selecciona "Configuración del proyecto"
3. Ve a la pestaña "General"
4. Desplázate hacia abajo hasta "Tus aplicaciones" y selecciona "Web" (ícono `</>`)
5. Registra tu aplicación con un nombre
6. Copia el objeto `firebaseConfig` que se muestra

## Paso 3: Configurar las variables de entorno

1. Crea un archivo llamado `.env.local` en la carpeta `frontend` con las siguientes variables:

```
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu_proyecto
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
```

Reemplaza los valores con los que obtuviste de tu objeto `firebaseConfig`.

## Paso 4: Reiniciar el servidor de desarrollo

Para que las variables de entorno sean reconocidas, debes reiniciar el servidor de desarrollo:

```bash
npm start
```

## Funcionalidades implementadas

- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Rutas protegidas que requieren autenticación
- Redirección a la página de login cuando se accede a rutas protegidas sin autenticación

## Cómo probar la autenticación

1. Inicia la aplicación con `npm start`
2. Intenta acceder a una ruta protegida (como la página principal)
3. Serás redirigido a la página de inicio de sesión
4. Registra una nueva cuenta o inicia sesión
5. Una vez autenticado, podrás acceder a las rutas protegidas 