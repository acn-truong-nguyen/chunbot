FROM node:10-alpine

# Set working directory
WORKDIR /u01/app/nodejs/bin

# Copy package.json to working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN apk add --no-cache --virtual .gyp \
      python \
      make \
      g++ \
 && npm install \
 && apk del .gyp 

# Copy source code to working directory
COPY . .

# using node.js port
EXPOSE 3000

CMD [ "npm", "start" ]
