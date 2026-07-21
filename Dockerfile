FROM node:22-alpine AS build
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
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
