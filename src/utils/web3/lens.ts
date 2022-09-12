/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parseIpfs } from './ipfs'
import type { lensPostCommentRaw, Web3LensRaw } from '@/types/web3/lens'
import type { Web3Media } from '@/types/web3/media'

export const commentLensQuery = (id: string, limit = 10, cursor = null) => {
  return {
    operationName: 'CommentFeed',
    variables: {
      request: {
        commentsOf: id,
        limit: limit,
        ...(cursor ? { cursor: JSON.stringify(JSON.stringify(cursor)) } : {})
      },
      reactionRequest: null,
      profileId: null
    },
    query:
      'query CommentFeed(\n\t$request: PublicationsQueryRequest!\n\t$reactionRequest: ReactionFieldResolverRequest\n\t$profileId: ProfileId\n) {\n\tpublications(request: $request) {\n\t\titems {\n\t\t\t... on Comment {\n\t\t\t\t...CommentFields\n\t\t\t\t__typename\n\t\t\t}\n\t\t\t__typename\n\t\t}\n\t\tpageInfo {\n\t\t\ttotalCount\n\t\t\tnext\n\t\t\t__typename\n\t\t}\n\t\t__typename\n\t}\n}\n\nfragment CommentFields on Comment {\n\tid\n\tprofile {\n\t\t...ProfileFields\n\t\t__typename\n\t}\n\treaction(request: $reactionRequest)\n\tmirrors(by: $profileId)\n\tstats {\n\t\t...StatsFields\n\t\t__typename\n\t}\n\tmetadata {\n\t\t...MetadataFields\n\t\t__typename\n\t}\n\thidden\n\tcreatedAt\n\tappId\n\t__typename\n}\n\nfragment ProfileFields on Profile {\n\tid\n\tname\n\thandle\n\tbio\n\townedBy\n\tattributes {\n\t\tkey\n\t\tvalue\n\t\t__typename\n\t}\n\tpicture {\n\t\t... on MediaSet {\n\t\t\toriginal {\n\t\t\t\turl\n\t\t\t\t__typename\n\t\t\t}\n\t\t\t__typename\n\t\t}\n\t\t... on NftImage {\n\t\t\turi\n\t\t\t__typename\n\t\t}\n\t\t__typename\n\t}\n\tfollowModule {\n\t\t__typename\n\t}\n\t__typename\n}\n\n\nfragment MetadataFields on MetadataOutput {\n\tname\n\tdescription\n\tcontent\n\tcover {\n\t\toriginal {\n\t\t\turl\n\t\t\t__typename\n\t\t}\n\t\t__typename\n\t}\n\tmedia {\n\t\toriginal {\n\t\t\turl\n\t\t\tmimeType\n\t\t\t__typename\n\t\t}\n\t\t__typename\n\t}\n\tattributes {\n\t\tvalue\n\t\t__typename\n\t}\n\t__typename\n}\n\nfragment StatsFields on PublicationStats {\n\ttotalUpvotes\n\ttotalAmountOfMirrors\n\ttotalAmountOfCollects\n\ttotalAmountOfComments\n\t__typename\n}\n\n\n'
  }
}

export const lensIdToRaw = (lensId: string) => lensId.replace('lens://', '')
export const rawToLensId = (lensId: string) => `lens://${lensId}`

const makeEmptyWeb3LensRaw = () =>
  ({
    creator: {}
  } as Web3LensRaw)

export const convertToWeb3Raw = (obj: lensPostCommentRaw): Web3LensRaw => {
  const retObj = makeEmptyWeb3LensRaw()
  retObj.creator!.avatar = parseIpfs(obj.profile?.picture?.original.url as string)
  retObj.creator!.address = obj.profile?.ownedBy
  retObj.creator!.handle = obj.profile?.handle
  retObj.creator!.fullname = obj.profile?.name
  retObj.content = obj?.metadata.content
  retObj.attachments = obj?.metadata.media as Web3Media
  retObj.createdAt = obj?.createdAt
  retObj.id = rawToLensId(obj?.id as string)
  return retObj
}
