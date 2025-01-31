#!/bin/bash

# Función para manejar errores
handle_error() {
    echo "Error: $1"
    exit 1
}

# Actualizar paquetes e instalar dependencias del sistema
echo "Actualizando paquetes e instalando dependencias del sistema..."
pkg update -y || handle_error "Falló la actualización de paquetes."
pkg install -y nodejs ffmpeg imagemagick webp || handle_error "Falló la instalación de dependencias."

# Verificar si Node.js y npm están instalados correctamente
echo "Verificando la instalación de Node.js y npm..."
node -v || handle_error "Node.js no está instalado correctamente."
npm -v || handle_error "npm no está instalado correctamente."

# Navegar al directorio del proyecto (si es necesario)
# Si ya tienes los archivos en Termux, simplemente navega al directorio del proyecto
# cd /ruta/a/tu/proyecto

# Verificar si el archivo package.json existe
if [ ! -f "package.json" ]; then
    handle_error "No se encontró el archivo package.json."
fi

# Instalar dependencias de Node.js
echo "Instalando dependencias de Node.js..."
npm install || handle_error "Falló la instalación de dependencias de Node.js."
npm install qrcode-terminal || handle_error "Falló la instalación de qrcode-terminal."

# Verificar si el archivo index.js existe
if [ ! -f "index.js" ]; then
    handle_error "No se encontró el archivo index.js."
fi

# Exponer el puerto 5000 (no es necesario en Termux, pero puedes usarlo)
echo "La aplicación estará disponible en el puerto 5000."

# Ejecutar la aplicación
echo "Iniciando la aplicación..."
node index.js --server || handle_error "Falló al ejecutar la aplicación."
