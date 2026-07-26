#!/usr/bin/env bash

set -u

for port in 4000 5173 3000; do
  if fuser -k "${port}/tcp" >/dev/null 2>&1; then
    echo "Processo da porta ${port} encerrado."
  else
    echo "Nenhum processo em execução na porta ${port}."
  fi
done
