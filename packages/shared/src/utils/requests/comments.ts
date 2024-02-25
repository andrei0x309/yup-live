const API_BASE = import.meta.env.VITE_YUP_API_BASE;


export const getComments = async ({ postId, apiBase = API_BASE, limit = 10, skip = 0 }:
    { postId: string, apiBase: string, limit?: number, skip?: number }) => {
    const empty = {
        comments: [],
        numComments: 0,
    }
    if (!postId) return empty;
    const req = await fetch(`${apiBase}/posts/comments/${postId}?limit=${limit}&skip=${skip}`);
    if (req.ok) {
        const data = await req.json();
        if (data) {
            return {
                comments: data?.posts ?? [],
                numComments: data?.count ?? 0,
            }
        }
    }
    return empty;
}
