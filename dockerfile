# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install TypeScript globally
RUN npm install -g typescript

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port your app runs on (change if necessary)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]