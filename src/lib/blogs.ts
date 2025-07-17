export async function fetchBlogById(id: string) {
  try {
    const res = await fetch(`${process.env.PROD_URL}/api/blogs/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch blog: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    return null;
  }
}
