FROM node:latest

# set working directory
RUN mkdir /usr/src/groupie-server
WORKDIR /usr/src/groupie-server

# add `/usr/src/groupie-server/node_modules/.bin` to $PATH
ENV PATH /usr/src/groupie-server/node_modules/.bin:$PATH

# install and cache app dependencies
ADD package.json /usr/src/groupie-server/package.json
RUN npm install

EXPOSE 3002

# start app
CMD ["npm", "start"]

