#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import socket
import gzip
import requests
import platform
import xml.etree.ElementTree as ET
import threading
import time
import math
from io import BytesIO
from urllib.parse import urlparse
import ssl

# Asegurarse de que las librerías necesarias están instaladas
try:
    import requests
except ImportError:
    print("Faltan dependencias. Instalando 'requests'...")
    os.system("pip install requests")

# Verificación de la versión de Python
if sys.version_info[0] < 3:
    print("Este script requiere Python 3. Por favor, actualiza tu versión de Python.")
    sys.exit(1)

# Definir constantes y configuraciones
DEBUG = False
DEFAULT_TIMEOUT = 10
GZIP_SUPPORT = True if gzip else False

def printer(message, quiet=False, debug=False, error=False, **kwargs):
    if debug and not DEBUG:
        return
    if error:
        kwargs['file'] = sys.stderr
    if not quiet:
        print(message, **kwargs)

# Función de conexión con timeout
def create_connection(address, timeout=DEFAULT_TIMEOUT, source_address=None):
    host, port = address
    try:
        sock = socket.create_connection((host, port), timeout, source_address)
        return sock
    except socket.error as e:
        printer(f"Error al conectar: {e}", error=True)
        raise

# Función para calcular distancia entre dos coordenadas
def distance(origin, destination):
    lat1, lon1 = origin
    lat2, lon2 = destination
    radius = 6371  # Radio de la Tierra en kilómetros

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radius * c

# Hacer una solicitud HTTP con manejo de errores
def fetch_url(url, timeout=DEFAULT_TIMEOUT):
    try:
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()  # Levanta un error en caso de respuestas no exitosas
        return response
    except requests.exceptions.RequestException as e:
        printer(f"Error en la solicitud HTTP: {e}", error=True)
        return None

# Función principal
def main():
    url = "https://www.speedtest.net/api/js/servers"
    response = fetch_url(url)
    if response:
        print(f"Contenido recibido de {url}: {response.text[:100]}...")

    # Otros procesos y lógica de tu aplicación...

if __name__ == "__main__":
    main()
