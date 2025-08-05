// import { serializeNonPOJOs } from "$lib/js/utils";

export async function GET({ locals, url }) {

  // Parse the page number from the search parameters; default to 1 if not provided
  const pageNumber = url.searchParams.get('page') || 1;

  // Fetch the posts from the PocketBase collection
  let posts;
  try {
    posts = await locals.pb.collection('posts').getList(pageNumber, 5, {
        sort: '-created',
        expand: 'author'
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return {
      status: 500,
      body: { message: "Failed to fetch posts." },
    };
  }

  // Return the posts as a stringified JSON Response
  return new Response(JSON.stringify(posts), {
    headers: { "Content-Type": "application/json" },
  });
}