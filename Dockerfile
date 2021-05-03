FROM node:lts-alpine as build-stage

WORKDIR /projects/github/robot-game
COPY . .
RUN npm install \
  && npm run build \
  && rm -rf node_modules

FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /projects/github/robot-game/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# Сборка образа
# sudo docker build -t robot-game .

# Запуск образа
# sudo docker run -p 3000:80 robot-game
