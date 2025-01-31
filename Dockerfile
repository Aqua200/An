#!/bin/bash

echo "🔄 Actualizando paquetes en Termux..."
termux-change-repo
pkg update -y && pkg upgrade -y

echo "📦 Instalando dependencias necesarias..."
pkg install -y nodejs-lts ffmpeg imagemagick webp git || { echo "❌ Error al instalar paquetes."; exit 1; }

# Verificar si las dependencias están correctamente instaladas
for cmd in node npm ffmpeg convert git; do
    if ! command -v $cmd &> /dev/null; then
        echo "❌ Error: $cmd no está instalado correctamente."
        exit 1
    fi
done

# Bloqueo para evitar que el proceso se detenga al apagar la pantalla
termux-wake-lock

# Clonar el repositorio si es necesario
# git clone <URL_DEL_REPOSITORIO>
# cd <NOMBRE_DEL_REPOSITORIO>

# Si los archivos ya están en Termux, navegar al directorio del proyecto
# cd /ruta/a/tu/proyecto

echo "📂 Verificando archivos del proyecto..."
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró 'package.json'. Asegúrate de estar en la carpeta correcta."
    exit 1
fi

echo "📦 Instalando dependencias de Node.js..."
npm install
npm install qrcode-terminal

echo "🔍 Verificando 'index.js'..."
if [ ! -f "index.js" ]; then
    echo "❌ Error: No se encontró 'index.js'."
    exit 1
fi

echo "🚀 Iniciando la aplicación en el puerto 5000..."
node index.js --server
