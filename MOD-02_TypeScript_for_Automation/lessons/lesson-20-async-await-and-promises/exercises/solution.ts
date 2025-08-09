// 1. Create a function that returns a Promise which resolves after a given number of milliseconds.
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 2. Create an async function that uses the function from #1 to log messages with a delay.
async function delayedLog() {
  console.log("Start");
  await delay(1000);
  console.log("After 1 second");
  await delay(1000);
  console.log("After 2 seconds");
}

// 3. Create a function that fetches data from a public API (e.g., https://jsonplaceholder.typicode.com/todos/1) and returns a Promise with the JSON data.
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function fetchTodo(): Promise<Todo> {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = await response.json();
  return data;
}

// 4. Create an async function that calls the function from #3 and logs the title of the fetched todo.
async function logTodoTitle() {
  try {
    const todo = await fetchTodo();
    console.log(`Todo Title: ${todo.title}`);
  } catch (error) {
    console.error("Failed to fetch todo:", error);
  }
}

// Run the functions
delayedLog();
logTodoTitle();