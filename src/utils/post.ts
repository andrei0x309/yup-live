export const postTypesPromises = {
  preloadGeneral: import(`@/components/content/post/post-types/general.vue`),
  preloadYoutube: import(`@/components/content/post/post-types/youtube.vue`),
  preLoadTweet: import(`@/components/content/post/post-types/tweet.vue`),
  preloadFarcaster: import(`@/components/content/post/post-types/farcaster.vue`),
  preloadLens: import(`@/components/content/post/post-types/lens.vue`),
  preloadPoap: import(`@/components/content/post/post-types/poap.vue`),
  preloadMirror: import(`@/components/content/post/post-types/mirror.vue`),
  preloadSnapshot: import(`@/components/content/post/post-types/snapshot.vue`)
}

export const makeRandomPreview = () => `/picsum/${Math.floor(Math.random() * 99)}.webp`

export const isImage = (url: string) => {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url)
}
