FROM node:argon

RUN npm install

CMD [ "npm", "start" ]
