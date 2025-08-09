# Lesson 12: Module Recap and Pipeline Optimization - Assessment

## Knowledge Check

### Question 1
What is a key benefit of the "Pipeline as Code" pattern?
- A) It makes the pipeline run faster.
- B) It allows the pipeline configuration to be version-controlled, reviewed, and managed just like application code.
- C) It eliminates the need for any manual intervention.
- D) It is the only way to run tests in a CI/CD environment.

**Answer: B**

### Question 2
Which of the following is a common CI/CD anti-pattern to avoid?
- A) Breaking the pipeline into smaller, focused jobs.
- B) Using a matrix strategy for cross-browser testing.
- C) Hardcoding secrets directly in the pipeline configuration file.
- D) Storing secrets in an encrypted vault and accessing them at runtime.

**Answer: C**

### Question 3
When optimizing a CI/CD pipeline for performance, what is an effective strategy?
- A) Running all jobs sequentially to avoid conflicts.
- B) Using intelligent caching for dependencies and build artifacts to avoid re-downloading or rebuilding them unnecessarily.
- C) Removing all tests to make the pipeline finish faster.
- D) Using the largest available machine for every job, regardless of its needs.

**Answer: B**

## Practical Application

### Scenario
You have been tasked with optimizing your project's CI/CD pipeline. After analysis, you've identified two main areas for improvement:
1.  The `npm install` step is slow because it re-downloads all dependencies on every run.
2.  The tests are run sequentially, but the unit tests and integration tests could be run in parallel to save time.

### Task
Create a GitHub Actions workflow file that addresses these two issues. The workflow should:
1.  **Cache Dependencies**: Use the `actions/cache` action to cache the `node_modules` directory. The cache should be invalidated whenever `package-lock.json` changes.
2.  **Parallel Jobs**: Define two separate jobs, `unit-tests` and `integration-tests`, that can run in parallel.
3.  **Job Dependency**: Add a final `build` job that only runs after both test jobs have completed successfully.

Provide the complete YAML configuration for this optimized workflow.