#!/bin/bash

# Función para manejar errores
handle_error() {
    echo "❌ Error: $1"
    exit 1
}

echo "🔄 Actualizando paquetes en Termux..."
termux-change-repo || handle_error "No se pudo cambiar el repositorio."
pkg update -y && pkg upgrade -y || handle_error "Error al actualizar paquetes."

echo "📦 Instalando dependencias necesarias..."
pkg install -y nodejs-lts ffmpeg imagemagick webp git || handle_error "Error al instalar paquetes."

# Verificar si las dependencias están correctamente instaladas
for cmd in node npm ffmpeg convert git; do
    command -v $cmd &> /dev/null || handle_error "$cmd no está instalado correctamente."
done

# Bloqueo para evitar que el proceso se detenga al apagar la pantalla
termux-wake-lock || handle_error "No se pudo activar el bloqueo de pantalla."

# Clonar el repositorio si es necesario
# git clone <URL_DEL_REPOSITORIO> || handle_error "No se pudo clonar el repositorio."
# cd <NOMBRE_DEL_REPOSITORIO> || handle_error "No se pudo acceder al directorio del repositorio."

# Si los archivos ya están en Termux, navegar al directorio del proyecto
# cd /ruta/a/tu/proyecto || handle_error "No se pudo acceder al directorio del proyecto."

echo "📂 Verificando archivos del proyecto..."
if [ ! -f "package.json" ]; then
    handle_error "No se encontró 'package.json'. Asegúrate de estar en la carpeta correcta."
fi

echo "📦 Instalando dependencias de Node.js..."
npm install || handle_error "Error al instalar dependencias de Node.js."
npm install qrcode-terminal || handle_error "Error al instalar qrcode-terminal."

echo "🔍 Verificando 'index.js'..."
if [ ! -f "index.js" ]; then
    handle_error "No se encontró 'index.js'."
fi

echo "🚀 Iniciando la aplicación en el puerto 5000..."
node index.js --server || handle_error "Error al iniciar la aplicación."
