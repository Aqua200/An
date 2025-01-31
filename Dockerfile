# Instalar Node.js (LTS)
pkg install nodejs -y

# Instalar dependencias del sistema
pkg install ffmpeg imagemagick webp -y

# Actualizar paquetes
pkg upgrade -y

# Clonar tu repositorio (si es necesario)
git clone <tu-repositorio>
cd <tu-repositorio>

# Instalar dependencias de Node.js
npm install
npm install qrcode-terminal

# Exponer el puerto (no es necesario en Termux, pero puedes usar el puerto 5000)
# No hay equivalente directo a EXPOSE en Termux

# Ejecutar la aplicación
node index.js --server
