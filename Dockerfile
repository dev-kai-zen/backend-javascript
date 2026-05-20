# Use lightweight Node.js 22 LTS base (Alpine for smaller size)
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts && \
    npm cache clean --force

# Copy application source code
COPY --chown=nodejs:nodejs . .

RUN chmod +x docker/entrypoint.sh

# Switch to non-root user
USER nodejs

# Expose the app port (Cloud Run expects 8080)
EXPOSE 8080

# Set environment variable for port (Cloud Run sets PORT env var)
ENV PORT=8080
ENV HOST=0.0.0.0

ENTRYPOINT ["docker/entrypoint.sh"]
CMD ["run"]