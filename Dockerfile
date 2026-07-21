FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# nginx.conf e certs/ são bind mounts em produção (ver docker-compose.yml no
# pacote de deploy) — o conf copiado aqui só serve pro build ficar completo.
# LOGHUB_API_URL/LOGHUB_API_KEY são runtime env vars: este script (hook nativo
# da imagem nginx, roda antes do nginx subir) gera env-config.js a partir delas.
COPY docker-entrypoint.d/40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh
EXPOSE 80 443
