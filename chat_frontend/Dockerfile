# chat_frontend/Dockerfile
# build stage
# ---- build stage ----
FROM mirror.gcr.io/library/node:18-alpine AS build

WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --silent

# copy source
COPY . .

# build with Vite (outputs to /app/dist)
RUN npm run build

# ---- production stage ----
FROM mirror.gcr.io/library/nginx:stable-alpine

# Copy Vite's build output (dist, not build)
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default conf with one that supports SPA fallback
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
