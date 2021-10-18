# pull official base image
FROM node:16-alpine3.14

# install react essentials
RUN npm install react-scripts@4.0.3 -g

# set working directory
WORKDIR /app

# create app dir
RUN chown node:node /app

# use unprivileged user
USER node

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
RUN npm install

# add app
COPY . ./

# start app
CMD ["npm", "start"]
