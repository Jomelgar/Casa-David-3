FROM node:20-alpine
WORKDIR /app

ENV DB_HOST=database
ENV DB_PORT=5432
ENV DB_USER="postgres"
ENV DB_PASSWORD="contra1234$"
ENV DB_NAME="CasaDavid"

ENV DEV_MODE=true
EXPOSE 3001

COPY . ./
RUN npm install

CMD ["npm", "run", "dev"]