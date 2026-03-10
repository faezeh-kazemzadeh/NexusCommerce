FROM node:alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY nodemon.json ./
RUN npm install  
COPY . .
EXPOSE 5000
CMD ["npm","run", "dev"]