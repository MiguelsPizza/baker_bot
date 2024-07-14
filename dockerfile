# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (if needed)
# EXPOSE 3000

# Command to run the application
CMD ["pnpm", "tsx", "bot.ts"]