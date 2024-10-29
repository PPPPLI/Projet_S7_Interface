FROM node:18 AS build

WORKDIR /app
COPY dist/frontend /app
EXPOSE 4200

RUN npm install && npm run build --prod

CMD ["http/server","/app","-p","4200"]