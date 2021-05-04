FROM node:15-alpine as sass-build-stage

RUN apk add --no-cache git python3 make g++

RUN git clone --recursive https://github.com/sass/node-sass.git

RUN cd node-sass \
    && npm install \
    && node scripts/build -f

FROM node:15-alpine as build-stage

COPY --from=sass-build-stage /node-sass/vendor/linux_musl-x64-88/binding.node /node-sass/vendor/linux_musl-x64-88/binding.node

ENV SASS_BINARY_PATH=/node-sass/vendor/linux_musl-x64-88/binding.node

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
