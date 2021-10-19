# Pull official base image
FROM node:16-alpine3.14

# Enable bash
RUN apk add --no-cache bash

# Install react essentials
RUN npm install react-scripts@4.0.3 -g && npm install -g serve

# Set working directory
WORKDIR /app

# Create app dir
RUN chown node:node /app

# Use unprivileged user
USER node

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
RUN npm install

# Add app
COPY --chown=node:node . ./

# Set the host variable in default.js (overwrite)
RUN echo "REACT_APP_API_URL='${REACT_APP_API_URL}'" > ./.env

# Start app
CMD ["/bin/bash", "entrypoint.sh"]
