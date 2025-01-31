#!/bin/bash

echo "🔄 Actualizando paquetes..."
apt update -y && apt upgrade -y

echo "📦 Instalando dependencias del sistema..."
apt install -y nodejs ffmpeg imagemagick webp git

# Verificar si Node.js y npm están instalados
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Error: Node.js o npm no están instalados correctamente."
    exit 1
fi

# Clonar el repositorio si es necesario (descomentar y reemplazar con tu URL)
# git clone <URL_DEL_REPOSITORIO>
# cd <NOMBRE_DEL_REPOSITORIO>

# Si los archivos ya están en Termux, navega al directorio del proyecto
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
