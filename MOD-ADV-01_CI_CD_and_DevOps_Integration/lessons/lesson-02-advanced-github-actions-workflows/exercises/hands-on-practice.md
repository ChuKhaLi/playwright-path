# Lesson 2: Advanced GitHub Actions Workflows - Exercises

## Exercise 1: Create a Matrix Workflow

1. **Create a new workflow file named `matrix-workflow.yml`.**
2. **Copy the example matrix workflow from the lesson into your file.**
3. **Modify the matrix to include `macos-latest` as an operating system.**
4. **Commit and push your changes to see the workflow run on all three operating systems.**

## Exercise 2: Use Artifacts to Share Data

1. **Create a new workflow with two jobs: `build` and `test`.**
2. **In the `build` job, create a file named `build-info.txt` with some content.**
3. **Upload the `build-info.txt` file as an artifact.**
4. **In the `test` job, download the artifact.**
5. **Add a step to the `test` job to print the contents of the `build-info.txt` file.**
6. **Make the `test` job dependent on the `build` job using the `needs` keyword.**