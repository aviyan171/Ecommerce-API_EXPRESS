#use node js image
FROM node:16-alpine3.11

#create a working directory in docker container
WORKDIR /app


#copy package json in app , package json is copied first for caching purpose
COPY package*.json ./

RUN npm install -g nodemon 

#Run npm installrs
RUN npm i

#Copy Rest of the code
COPY . .

#Expose port 4000
EXPOSE 4000

CMD [ "npm","run","dev" ]










