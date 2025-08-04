# Lesson 3: Docker Fundamentals for Testing - Exercises

## Exercise 1: Build and Run a Docker Image

1. **Create a `Dockerfile` in your project root.**
2. **Copy the example `Dockerfile` content from the lesson.**
3. **Build the Docker image using the `docker build` command.**
   ```bash
   docker build -t playwright-tests .
   ```
4. **Run the Docker container using the `docker run` command.**
   ```bash
   docker run playwright-tests
   ```

## Exercise 2: Push to Docker Hub

1. **Create a Docker Hub account if you don't have one.**
2. **Log in to Docker Hub from your terminal.**
   ```bash
   docker login
   ```
3. **Tag your image with your Docker Hub username.**
   ```bash
   docker tag playwright-tests your-dockerhub-username/playwright-tests
   ```
4. **Push the image to Docker Hub.**
   ```bash
   docker push your-dockerhub-username/playwright-tests