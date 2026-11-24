#!/bin/bash

psql \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --set=ON_ERROR_STOP=1 \
  --set=fotos_user="$FOTOS_DB_USER" \
  --set=fotos_password="$FOTOS_DB_PASSWORD" \
  --set=fotos_db="$FOTOS_DB_NAME" <<'SQL'
CREATE ROLE :"fotos_user" LOGIN PASSWORD :'fotos_password';
CREATE DATABASE :"fotos_db" OWNER :"fotos_user";
SQL
