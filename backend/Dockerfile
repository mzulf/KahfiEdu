# Gunakan Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (termasuk devDependencies untuk patch-package)
RUN npm install

# Copy semua file
COPY . .

# Expose port
EXPOSE 8080

# Start aplikasi
CMD ["node", "index.js"]