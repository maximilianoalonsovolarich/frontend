# Configuración de Firebase en Producción

Cuando despliegues tu aplicación en producción, necesitarás configurar Firebase correctamente. Aquí hay algunas recomendaciones:

## 1. Variables de Entorno en Producción

Dependiendo de tu plataforma de despliegue, deberás configurar las variables de entorno. Algunos ejemplos:

### Para Google Cloud Run

Puedes configurar variables de entorno en el archivo `cloudbuild.yaml` o directamente en la consola de Google Cloud:

```yaml
steps:
  # ... otros pasos
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
    - 'run'
    - 'deploy'
    - 'tu-servicio'
    - '--image=gcr.io/$PROJECT_ID/tu-imagen:$COMMIT_SHA'
    - '--region=us-central1'
    - '--platform=managed'
    - '--allow-unauthenticated'
    - '--set-env-vars=REACT_APP_FIREBASE_API_KEY=tu_api_key,REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com,REACT_APP_FIREBASE_PROJECT_ID=tu_proyecto,REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com,REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id,REACT_APP_FIREBASE_APP_ID=tu_app_id'
```

### Para Vercel, Netlify u otras plataformas

Estas plataformas tienen interfaces para configurar variables de entorno directamente en su dashboard.

## 2. Seguridad en Firebase

### Configurar Reglas de Autenticación

En la consola de Firebase, configura las reglas de autenticación para limitar quién puede registrarse:

1. Ve a "Authentication" > "Configuración" > "Acceso mediante correo electrónico/contraseña"
2. Habilita o deshabilita "Acceso mediante email/contraseña"
3. Opcionalmente, habilita "Verificación por correo electrónico" para mayor seguridad

### Configurar Reglas de Dominio

Asegúrate de agregar los dominios permitidos para el inicio de sesión:

1. Ve a "Authentication" > "Configuración" > "Dominios autorizados"
2. Agrega los dominios de tu aplicación en producción

## 3. Monitoreo y Análisis

Habilita el monitoreo de Firebase Authentication:

1. Ve a "Authentication" > "Uso"
2. Revisa las estadísticas de inicio de sesión
3. Configura alertas para actividades sospechosas

## 4. Pruebas antes de Producción

Antes de desplegar a producción:

1. Prueba el flujo completo de autenticación en un entorno de staging
2. Verifica que las redirecciones funcionen correctamente
3. Comprueba que las rutas protegidas estén realmente protegidas

## 5. Implementación con CI/CD

Si utilizas un sistema de CI/CD, asegúrate de que las variables de entorno de Firebase estén configuradas en tu pipeline. 