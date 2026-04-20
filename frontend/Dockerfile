FROM node:20-alpine

WORKDIR /app

# Copiar el package.json y package-lock.json para cachear dependencias
COPY package*.json ./

RUN npm install

# Copiar el código fuente
COPY . .

EXPOSE 5173

# Vite en modo host para que se acceda desde el navegador en localhost
CMD ["npm", "run", "dev", "--", "--host"]
