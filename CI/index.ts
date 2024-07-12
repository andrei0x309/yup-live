import { YupAPI } from 'yup-api-interact'

const args = Bun.argv.slice(2);

const secrets = args[0]
const event = args[1]
const action = args[2]

type TGithubEvent = {
    inputs: {
        version: string
    },
    forced: boolean,
    repository: {
        name: string,
        full_name: string,
        html_url: string,
        description: string
    },
    head_commit: {
        id: string,
        message: string,
        timestamp: string,
        url: string,
        author: {
            name: string,
            email: string,
            username: string
        },
        committer: {
            name: string,
            email: string,
            username: string
        }
    }
}

const main = async () => {
    const ENABLED = true;
    let YUP_TOKEN = '';
    let GithubEvent: TGithubEvent = {} as TGithubEvent;

    console.log('Anouncement enabled status: ', '[ ', ENABLED, ' ]');

    try {
        const parsedSecrets = JSON.parse(secrets);
        YUP_TOKEN = parsedSecrets.YUP_TOKEN;
        GithubEvent = JSON.parse(event);
    } catch (e) {
        console.error('Error parsing data', e)
    }

    const yupAPI = new YupAPI({ token: YUP_TOKEN });

    if (action === 'update') {
        const VERSION = GithubEvent.inputs.version;
        const message = `Github ClearWallet new version ${VERSION} has been released!\n
        ChromeStore: https://bit.ly/yup-live-android \n
        Github: https://github.com/andrei0x309/yup-live
        `;

        if (ENABLED) {
            await yupAPI.sendPost({
                content: message,
                platforms: ['twitter', 'bsky', 'lens', 'farcaster']
            })
        } else {
            console.log('No action required')
        }

    } else if (action === 'push') {
        if (ENABLED && !GithubEvent.forced && GithubEvent?.head_commit?.message.includes('chore:')) {
            const commiter = GithubEvent?.head_commit?.author.username || GithubEvent?.head_commit?.committer?.username || ''
            const message = `Github YupLive new repo commit!\n
            Deployment: https://yup.live \n
            Commit: ${GithubEvent.head_commit.url} \n
            ${commiter ? `By: ${commiter}` : ''}
            `;

            await yupAPI.sendPost({
                content: message,
                platforms: ['twitter', 'bsky', 'lens', 'farcaster']
            })
        } else {
            console.log('No action required')
        }
    }

    console.log('Workflow executed successfully');

}

main().catch(console.error);
