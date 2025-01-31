#!/bin/bash

# Detener el script si algún comando falla
set -e

# Definir colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir mensajes en verde
print_green() {
    echo -e "${GREEN}$1${NC}"
}

# Función para imprimir mensajes en rojo
print_red() {
    echo -e "${RED}$1${NC}"
}

# Función para imprimir mensajes en amarillo
print_yellow() {
    echo -e "${YELLOW}$1${NC}"
}

# Función para imprimir mensajes en azul
print_blue() {
    echo -e "${BLUE}$1${NC}"
}

# Función para imprimir mensajes en cian
print_cyan() {
    echo -e "${CYAN}$1${NC}"
}

# Función para simular una barra de progreso
progress_bar() {
    local duration=${1}
    local bar_length=30
    local sleep_interval=$(echo "scale=2; $duration/$bar_length" | bc)
    for ((i=0; i<=bar_length; i++)); do
        printf "${BLUE}["
        for ((j=0; j<i; j++)); do printf "="; done
        for ((j=i; j<bar_length; j++)); do printf " "; done
        printf "] ${CYAN}%3d%%${NC}\r" $((i*100/bar_length))
        sleep $sleep_interval
    done
    printf "\n"
}

# Función para verificar e instalar Node.js y npm
install_node_npm() {
    if ! command -v node &> /dev/null; then
        print_red "Node.js no está instalado. Instalando Node.js..."
        progress_bar 2
        if [[ "$OSTYPE" == "linux-android"* ]]; then
            pkg install nodejs -y
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt update && sudo apt install nodejs -y
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install node
        else
            print_red "Sistema operativo no compatible. Instala Node.js manualmente."
            exit 1
        fi
        print_green "Node.js instalado correctamente."
    fi

    if ! command -v npm &> /dev/null; then
        print_red "npm no está instalado. Instalando npm..."
        progress_bar 2
        if [[ "$OSTYPE" == "linux-android"* ]]; then
            pkg install npm -y
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt install npm -y
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install npm
        else
            print_red "Sistema operativo no compatible. Instala npm manualmente."
            exit 1
        fi
        print_green "npm instalado correctamente."
    fi
}

# Mensaje de bienvenida
print_cyan "==========================================="
print_cyan "  Bienvenido al script de configuración del bot"
print_cyan "==========================================="
echo ""

# Verificar e instalar Node.js y npm
install_node_npm

# Número máximo de reintentos (puede pasarse como argumento)
MAX_RETRIES=${1:-3}
RETRY_COUNT=0

# Bucle principal para instalar dependencias e iniciar el bot
while [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; do
    echo ""
    print_yellow "Instalando dependencias de npm..."
    progress_bar 3
    if npm install; then
        print_green "¡Dependencias instaladas correctamente!"
        print_yellow "Iniciando el bot..."
        progress_bar 2
        if npm start; then
            print_green "¡Bot iniciado correctamente!"
            break  # Salir del bucle si el bot se inicia correctamente
        else
            print_red "Error al iniciar el bot."
            RETRY_COUNT=$((RETRY_COUNT + 1))
            if [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; then
                print_yellow "Reintentando... ($RETRY_COUNT/$MAX_RETRIES)"
            else
                print_red "Se alcanzó el número máximo de reintentos. Saliendo..."
                exit 1
            fi
        fi
    else
        print_red "Error al instalar las dependencias de npm."
        exit 1  # Salir si la instalación de dependencias falla
    fi
    sleep 1  # Esperar 1 segundo antes de reintentar
done

# Mensaje de despedida
print_cyan "==========================================="
print_cyan "  ¡Gracias por usar el script de configuración!"
print_cyan "==========================================="
