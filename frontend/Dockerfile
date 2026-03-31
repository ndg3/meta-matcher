# STAGE 1: Build
FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

# STAGE 2: Production build
FROM nginxinc/nginx-unprivileged:alpine3.23 AS runner

# Dev
#COPY nginx.dev.conf /etc/nginx/nginx.conf

# Prod
COPY nginx.prod.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/out /usr/share/nginx/html

USER nginx

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
