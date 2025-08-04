# Use the official Playwright image
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set the working directory
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Install dependencies
RUN npm ci

# Run the tests
CMD ["npx", "playwright", "test"]