# Configuración de la Autenticación con Google en Firebase

Para habilitar la autenticación con Google en tu aplicación, sigue estos pasos:

## 1. Habilitar el proveedor de autenticación de Google

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto (AuroraSQL)
3. En el menú de la izquierda, selecciona "Authentication"
4. Ve a la pestaña "Sign-in method"
5. Haz clic en "Google" en la lista de proveedores
6. Activa el interruptor "Enable" para habilitar este método
7. Configura un nombre de proyecto (se mostrará a los usuarios durante el login)
8. Agrega tu correo electrónico de soporte
9. Haz clic en "Save"

## 2. Configurar dominios autorizados

1. En la misma sección de Authentication, ve a la pestaña "Settings"
2. Desplázate hasta "Authorized domains"
3. Asegúrate de que los dominios donde funcionará tu aplicación estén en la lista
4. Para desarrollo local, "localhost" debería estar incluido por defecto

## 3. Configurar permisos para limitar el acceso

Para limitar el acceso solo a correos específicos (max@auroragrass.nl y paul@auroragrass.nl), ya hemos implementado un control en el código de la aplicación. La lista de correos permitidos se define en `src/contexts/AuthContext.js`:

```javascript
// Lista de correos electrónicos permitidos
const ALLOWED_EMAILS = [
  'max@auroragrass.nl',
  'paul@auroragrass.nl'
];
```

Si necesitas agregar más correos, simplemente añádelos a esta lista.

## 4. Testing de la autenticación

1. Inicia la aplicación con `npm start`
2. Intenta iniciar sesión con el botón "Iniciar Sesión con Google"
3. Selecciona una cuenta de Google
4. Si la cuenta NO está en la lista de permitidos, se mostrará un mensaje de error
5. Si la cuenta está en la lista de permitidos, se iniciará sesión correctamente

## 5. Configuración adicional en producción

Para entornos de producción, debes:

1. Añadir los dominios de producción a la lista de dominios autorizados
2. Considerar la posibilidad de usar Firebase Authentication emulator para pruebas
3. Revisar las reglas de seguridad para asegurar que solo los usuarios autenticados puedan acceder a los datos sensibles

## 6. Otras opciones de seguridad

Para una seguridad adicional, puedes:

1. Habilitar la verificación de correo electrónico para cuentas creadas por email/contraseña
2. Configurar la política de contraseñas
3. Habilitar la protección contra actividades sospechosas

## 7. Mantenimiento de la lista de usuarios

Para gestionar los usuarios permitidos, tienes dos opciones:

1. **Opción básica:** Mantener la lista de usuarios permitidos en el código (como está ahora)
2. **Opción avanzada:** Crear una colección de usuarios permitidos en Firestore y consultar esta base de datos en lugar de usar una lista estática

La opción avanzada es más flexible pero requiere configuración adicional. 