# Use official Node.js image for building React app
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Fix: Use 'npm run build' (no need for 'npm start' script in React static build)
COPY . .
RUN npm run build

# Serve the build with a lightweight web server
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
