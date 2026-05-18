# --- run ---
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install sequelize-cli --no-save

COPY src ./src
COPY database ./database
COPY .sequelizerc ./

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
# Default subcommand for `docker compose up` (see docker/entrypoint.sh).
CMD ["run"]
