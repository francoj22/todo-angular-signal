# Stage 1: Build Angular app
FROM node:22-alpine AS build

WORKDIR /app

# Match the project's npm version for consistent lockfile resolution.
RUN npm i -g npm@11.6.0

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/todo-angular-signal/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]