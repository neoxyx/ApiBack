FROM node:16

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://mongo:27017/catapi

EXPOSE 3000
CMD ["node", "server.js"]