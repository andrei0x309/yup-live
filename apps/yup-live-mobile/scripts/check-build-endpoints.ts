import { API_BASE as API_BASE_AUTH } from 'shared/src/utils/auth'
import { API_BASE as API_BASE_WEB3_POSTING } from 'shared/src/utils/requests/web3-posting'
import { API_BASE as API_BASE_THREADS } from 'shared/src/utils/requests/threads'
import { API_BASE as API_BASE_TEAM } from 'shared/src/utils/requests/team'
import { API_BASE as API_BASE_FARCASTER } from 'shared/src/utils/requests/farcaster'
import { API_BASE as API_BASE_ACCOUNTS } from 'shared/src/utils/requests/accounts'
import { API_BASE as API_BASE_BSKY } from 'shared/src/utils/requests/bsky'
import { API_BASE as API_MASTODON } from 'shared/src/utils/requests/mastodon'

const ENDPOINTS = [
    API_BASE_AUTH,
    API_BASE_WEB3_POSTING,
    API_BASE_THREADS,
    API_BASE_TEAM,
    API_BASE_FARCASTER,
    API_BASE_ACCOUNTS,
    API_BASE_BSKY,
    API_MASTODON
]

const checkEndpointsForProd = () => {
    for (const endpoint of ENDPOINTS) {
        if (endpoint.includes('dev.') || endpoint.includes('fstun.')) {
            console.error('Endpoint should not contain dev. or fstun. in production:', endpoint)
            process.exit(1)
        }
    }
    console.log('All endpoints are correct for production')
}

checkEndpointsForProd()
