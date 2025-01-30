#!/bin/bash

# Lista de carpetas a verificar
carpetas=("folder1" "folder2" "folder3")

for carpeta in "${carpetas[@]}"; do
  if [ ! -d "$carpeta" ]; then
    echo "La carpeta $carpeta no existe. Borrando..."
    rm -rf "$carpeta"
  else
    echo "La carpeta $carpeta existe."
  fi
done
