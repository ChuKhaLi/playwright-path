// 1. Define an interface or type for a Post object from jsonplaceholder.typicode.com/posts.
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// 2. Create an async function to fetch all posts and return them as an array of the type you defined.
async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  return data;
}

// 3. Create an async function that takes a post object (of the type you defined) and sends a POST request to create a new post.
async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(post),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const data = await response.json();
  return data;
}

// 4. Create an async function that calls the fetch function, takes the first post from the array, modifies its title, and then calls the create post function with the modified post.
async function main() {
  try {
    const posts = await fetchPosts();
    if (posts.length > 0) {
      const firstPost = posts[0];
      
      const newPostPayload: Omit<Post, 'id'> = {
        userId: firstPost.userId,
        title: "My New Post Title",
        body: firstPost.body,
      };

      const createdPost = await createPost(newPostPayload);
      console.log("Created Post:", createdPost);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();