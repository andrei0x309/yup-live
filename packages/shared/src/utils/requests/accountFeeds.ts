import { config } from '../config'

const API_BASE = config.API_BASE || ''

import { getBlockedPosts } from '../post'

export const getWeb3CreatedFeed = async (apiBase = API_BASE, start = 0, evmAddress: string) => {
    const res = await fetch(
        `${apiBase}/profile/posts/${evmAddress}?start=${start}&limit=10`
    );
    const posts = await res.json();
    const blockedPosts = await getBlockedPosts();
    // return posts.filter((post: any) => !blockedPosts.includes(post.id));
    return posts;
};


export const getLikesFeed = async (apiBase = API_BASE, start = 0, userId: string) => {
    if (!userId) return [];
    const res = await fetch(
        `${apiBase}/feed/account/${userId}?start=${start}&limit=10`
    );
    const data = await res.json();
    const blockedPosts = await getBlockedPosts();
    const posts = data.posts.filter(
        (post: any) => !blockedPosts.includes(post?._id?.postid)
    );
    return posts.sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
