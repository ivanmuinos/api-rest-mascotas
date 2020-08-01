##########################################################################
##########          Dockerfile to configure Pets API         #############
##########################################################################

FROM node

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3700

CMD ["npm", "start"]