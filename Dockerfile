FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_LOGHUB_API_URL
ARG VITE_LOGHUB_API_KEY
ENV VITE_LOGHUB_API_URL=$VITE_LOGHUB_API_URL
ENV VITE_LOGHUB_API_KEY=$VITE_LOGHUB_API_KEY
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# nginx.conf e certs/ são bind mounts em produção (ver docker-compose.yml no
# pacote de deploy) — o conf copiado aqui só serve pro build ficar completo.
EXPOSE 80 443
