# TaskMaster - Gestor de Tareas Académicas

![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Una aplicación móvil multiplataforma para gestión de tareas académicas y personales, desarrollada con Ionic React y Capacitor.

## 🎯 Estado del Proyecto

### ✅ Fase 1 Completada
- **Sistema CRUD completo** para tareas (Crear, Leer, Actualizar, Eliminar)
- **Almacenamiento local persistente** con Ionic Storage y Capacitor
- **Interfaz moderna** con Floating Action Button, modales y chips
- **Categorización** de tareas (Estudio, Personal, Trabajo, Urgente)
- **Persistencia de datos** en dispositivo móvil usando SQLite
- **Desarrollo multiplataforma** (iOS, Android, Web)

## 🚀 Características Implementadas

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| Crear tareas | ✅ | Modal con formulario y selector de categorías |
| Listar tareas | ✅ | Interfaz con checkboxes y estados visuales |
| Marcar completadas | ✅ | Toggle con feedback visual |
| Eliminar tareas | ✅ | Confirmación con alerta |
| Categorización | ✅ | 4 categorías con colores distintivos |
| Persistencia local | ✅ | Ionic Storage + Capacitor Preferences |
| Estadísticas | ✅ | Contadores en tiempo real |

## 🛠️ Stack Tecnológico

- **Framework:** Ionic React 7.x
- **Lenguaje:** TypeScript
- **Almacenamiento:** Ionic Storage + Capacitor Preferences
- **UI Components:** Ionic Framework
- **Gestión de Estado:** React Hooks personalizados
- **ID Generation:** UUID v4


## 🚀 Instalación y Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/TU_USER/taskmaster-app.git

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ionic serve

# Construir para producción
ionic build

# Agregar plataforma móvil
npx cap add android
npx cap add ios

# Desarrollo
ionic serve                    # Servidor desarrollo
ionic build                    # Build producción

# Capacitor
npx cap sync                  # Sincronizar con native
npx cap open android          # Abrir Android Studio
npx cap open ios              # Abrir Xcode

```

📊 ESTADO ACTUAL DEL PROYECTO:

🎯 FASE 1 - COMPLETADA 100%
├── ✅ Sistema CRUD tareas
├── ✅ Interfaz gráfica Ionic
├── ✅ Persistencia datos local
├── ✅ Control versiones Git
├── ✅ Repositorio GitHub
└── ✅ Build Android funcionando
