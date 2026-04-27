# STAGE 1: Build
FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

# STAGE 2: Production build
FROM nginxinc/nginx-unprivileged:alpine3.23 AS runner

COPY nginx.conf.in /etc/nginx/nginx.conf.in

ARG SERVER=localhost

RUN ["/bin/sh", "-c", "envsubst '$SERVER' < /etc/nginx/nginx.conf.in > /etc/nginx/nginx.conf"]

COPY --chown=nginx:nginx --from=builder /app/out /usr/share/nginx/html

USER nginx

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
