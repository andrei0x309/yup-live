import type { mediaType } from '../post'

export interface TweetData {
  userName: string
  userHandle: string
  userAvatar: string
  body: string
  verified: boolean
  mediaEntities: mediaType[]
}

export interface TweetRaw {
  text?: string
  full_text?: string
  user: {
    name?: string
    screen_name?: string
    profile_image_url_https?: string
    verified?: boolean
  }
  extended_entities?: {
    media: Array<{
      video_info?: {
        variants: Array<{
          url: string
        }>
      }
      type?: string
      media_url_https?: string
    }>
  }
}
