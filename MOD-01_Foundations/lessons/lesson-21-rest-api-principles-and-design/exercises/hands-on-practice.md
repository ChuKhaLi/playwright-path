# Lesson 21: REST API Principles and Design - Hands-On Practice

## Objective

This exercise is a design-focused thought experiment. You will act as an API designer and apply REST principles to define the endpoints for a simple application. This will help you learn to recognize well-designed APIs when you are testing them.

## The Application: A Simple "Project Tracker"

Imagine you are building an API for a project tracker. The API needs to manage two main resources: **Projects** and **Tasks**.

-   A **Project** has an `id`, a `name`, and a `description`.
-   A **Task** has an `id`, a `title`, a `status` (e.g., "pending", "in-progress", "completed"), and belongs to a specific project.

## Tasks

For each of the scenarios below, determine the correct **HTTP Method** and the ideal **RESTful URI**.

---

### Part 1: Managing Projects

1.  **Action:** Get a list of all projects.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

2.  **Action:** Create a new project.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

3.  **Action:** Get the details of a single project with an ID of `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

4.  **Action:** Completely update the project with an ID of `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

5.  **Action:** Delete the project with an ID of `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

---

### Part 2: Managing Tasks (within a Project)

Remember, tasks belong to a project. The URI should reflect this relationship.

1.  **Action:** Get all tasks for the project with an ID of `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

2.  **Action:** Create a new task for the project with an ID of `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

3.  **Action:** Get a single task with an ID of `12` from project `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

4.  **Action:** Update only the `status` of task `12` within project `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

5.  **Action:** Delete task `12` from project `789`.
    -   **HTTP Method:** \_\_\_\_\_
    -   **URI:** \_\_\_\_\_

---

### Part 3: Design Analysis (Critical Thinking)

1.  An engineer on your team suggests creating an endpoint `POST /tasks/moveTaskToNewProject`. Why is this NOT a good RESTful design? What would be a better way to handle moving a task from one project to another using REST principles? (Hint: Think about which resource you are *updating*).

2.  Your API returns the following JSON when a user requests a single project. How could you improve this response to be more aligned with the HATEOAS principle?

    ```json
    {
      "id": 789,
      "name": "Website Redesign",
      "description": "A complete overhaul of the company website."
    }
    ```

## Solutions

<details>
<summary>Click to view solutions</summary>

### Part 1: Managing Projects

1.  **Method:** `GET`, **URI:** `/projects`
2.  **Method:** `POST`, **URI:** `/projects`
3.  **Method:** `GET`, **URI:** `/projects/789`
4.  **Method:** `PUT`, **URI:** `/projects/789`
5.  **Method:** `DELETE`, **URI:** `/projects/789`

### Part 2: Managing Tasks

1.  **Method:** `GET`, **URI:** `/projects/789/tasks`
2.  **Method:** `POST`, **URI:** `/projects/789/tasks`
3.  **Method:** `GET`, **URI:** `/projects/789/tasks/12`
4.  **Method:** `PATCH`, **URI:** `/projects/789/tasks/12` (PATCH is best for partial updates).
5.  **Method:** `DELETE`, **URI:** `/projects/789/tasks/12`

### Part 3: Design Analysis

1.  The URI `/tasks/moveTaskToNewProject` uses a verb ("moveTask"), which violates REST principles. A better approach is to think of this as an **update** to the task resource. You would send a `PATCH` request to `/projects/{old_project_id}/tasks/{task_id}` with a body like `{"projectId": "{new_project_id}"}`. The logic of moving the task is handled by the server.

2.  To align with HATEOAS, you would add a `_links` object to the response that tells the client what they can do next.

    ```json
    {
      "id": 789,
      "name": "Website Redesign",
      "description": "A complete overhaul of the company website.",
      "_links": {
        "self": { "href": "/projects/789" },
        "tasks": { "href": "/projects/789/tasks" },
        "update": { "href": "/projects/789", "method": "PUT" },
        "delete": { "href": "/projects/789", "method": "DELETE" }
      }
    }
    ```

</details>