FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

ARG VITE_API_BASE_URL
RUN test -n "$VITE_API_BASE_URL" || (echo "VITE_API_BASE_URL must be set to the deployed API origin" >&2; exit 1)
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080