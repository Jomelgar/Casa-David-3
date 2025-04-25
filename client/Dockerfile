FROM node:20-alpine
WORKDIR /app

ENV DEV_MODE=true
ENV API_PORT=3001
ENV HOST=0.0.0.0
EXPOSE 3000

COPY package*.json ./
RUN npm install
RUN npm install react-scripts

COPY . ./
CMD ["npm", "run", "start"]
