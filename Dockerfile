# --- run ---
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
# Install Sequelize CLI after prod deps (`sequelize-cli` is a devDependency in package.json).
# Do not set NODE_ENV=production yet — it can suppress installing that extra package reliably.
RUN npm ci --omit=dev && npm install sequelize-cli --no-save

ENV NODE_ENV=production

COPY src ./src
COPY database ./database
COPY .sequelizerc ./

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
# Default subcommand for `docker compose up` (see docker/entrypoint.sh).
CMD ["run"]
