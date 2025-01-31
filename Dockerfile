#!/bin/bash

# Actualizar paquetes e instalar dependencias del sistema
pkg update -y
pkg install -y nodejs ffmpeg imagemagick webp

# Clonar el repositorio (si es necesario)
# git clone <tu-repositorio>
# cd <tu-repositorio>

# Si ya tienes los archivos en Termux, simplemente navega al directorio del proyecto
# cd /ruta/a/tu/proyecto

# Instalar dependencias de Node.js
if [ -f "package.json" ]; then
    npm install
    npm install qrcode-terminal
else
    echo "Error: No se encontró el archivo package.json."
    exit 1
fi

# Verificar si el archivo index.js existe
if [ ! -f "index.js" ]; then
    echo "Error: No se encontró el archivo index.js."
    exit 1
fi

# Exponer el puerto 5000 (no es necesario en Termux, pero puedes usarlo)
echo "La aplicación estará disponible en el puerto 5000."

# Ejecutar la aplicación
node index.js --server
