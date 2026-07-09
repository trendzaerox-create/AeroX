# Use Node.js 20 Alpine image as the first stage named "deps"
# This stage is only for installing dependencies
FROM node:20-alpine AS deps

# Set working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container
# package*.json means it copies both package.json and package-lock.json if available
COPY package*.json ./

# Install exact dependencies from package-lock.json
# npm ci is recommended for production/build because it is clean and reproducible
RUN npm ci


# Use Node.js 20 Alpine image as the second stage named "builder"
# This stage builds the Next.js application
FROM node:20-alpine AS builder

# Set working directory inside the container to /app
WORKDIR /app

# Copy node_modules from the deps stage
# This avoids installing dependencies again
COPY --from=deps /app/node_modules ./node_modules

# Copy all project files into the container
# This includes app, pages, public, next.config.js, etc.
COPY . .

# Define build-time argument for frontend API base URL
# This value comes from docker-compose build args
ARG NEXT_PUBLIC_API_BASE_URL

# Set the API base URL as an environment variable during build
# Next.js uses NEXT_PUBLIC_* variables while building frontend code
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Build the Next.js application
# This creates the .next production build folder
RUN npm run build


# Use Node.js 20 Alpine image as the final production stage named "runner"
# This stage contains only the files needed to run the app
FROM node:20-alpine AS runner

# Set working directory inside the final container
WORKDIR /app

# Set Node.js environment to production
# This improves performance and disables dev features
ENV NODE_ENV=production

# Set the port where Next.js will run inside the container
ENV PORT=3000

# Make the Next.js server listen on all network interfaces
# Required so Docker/Caddy can access the container
ENV HOSTNAME=0.0.0.0

# Define the API base URL again for runtime
ARG NEXT_PUBLIC_API_BASE_URL

# Store the API base URL in the production container
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Copy the public folder from the builder stage
# This contains static assets like images, icons, etc.
COPY --from=builder /app/public ./public

# Copy the standalone Next.js server output
# This works only if next.config.js has: output: "standalone"
COPY --from=builder /app/.next/standalone ./

# Copy Next.js static build files
# These are required for CSS, JS chunks, and static assets
COPY --from=builder /app/.next/static ./.next/static

# Inform Docker that this container uses port 3000
EXPOSE 3000

# Start the Next.js standalone production server
CMD ["node", "server.js"]