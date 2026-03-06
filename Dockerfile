FROM node:20-alpine AS build
WORKDIR /app 
COPY package.json ./ 
RUN npm install 
COPY . . 
RUN npm run build
RUN npm install -g serve json-server concurrently
EXPOSE 3000
EXPOSE 5001
CMD ["npm", "run", "start:prod"]
