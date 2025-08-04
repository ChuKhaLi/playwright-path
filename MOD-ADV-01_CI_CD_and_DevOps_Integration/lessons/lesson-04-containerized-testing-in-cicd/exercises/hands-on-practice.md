# Lesson 4: Containerized Testing in CI/CD - Exercises

## Exercise 1: Run Tests with Docker Compose

1. **Create a `docker-compose.yml` file in your project root.**
2. **Copy the example `docker-compose.yml` content from the lesson.**
3. **Run the tests using `docker-compose`.**
   ```bash
   docker-compose run playwright
   ```

## Exercise 2: Integrate Docker into a GitHub Actions Workflow

1. **Create a new GitHub Actions workflow file.**
2. **Add steps to check out the code, build the Docker image, and run the tests inside the container.**
3. **Use the `docker/login-action` to log in to Docker Hub.**
4. **Use the `docker/build-push-action` to build and push the image to Docker Hub.**
5. **Run the tests using the pushed image in a separate job.**