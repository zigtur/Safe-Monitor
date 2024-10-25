# Step 1: Use a Node.js image as the base
FROM node:18-alpine AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package.json ./
COPY package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the project files
COPY . .

# Step 6: Build TypeScript files
RUN npm run build

# Step 7: Use a lightweight Node.js image for production
FROM node:18-alpine AS production

# Step 8: Set the working directory in the new image
WORKDIR /app

# Step 9: Copy only the necessary files from the build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.params.json ./

# Step 10: Start the application
CMD ["node", "dist/index.js"]
