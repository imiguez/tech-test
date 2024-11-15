FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nest build


FROM build AS production
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/firebase-admin.json /app/firebase-admin.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json


CMD ["node", "dist/src/main"]
