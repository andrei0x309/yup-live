import { fetchWAuth } from './../auth';
import { ref, Ref } from 'vue'
import type { IMainStore } from '../../types/store'
import { wait } from 'shared/src/utils/time'
import { IErrorObj } from 'shared/src/types/errorObj'

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

const PERMISSIONS = ['addFollowers', 'addOAuthCredentials']

export const linkTwitter = async (store: IMainStore, addFollowers = false, linkAuth = true, cancel = ref(false)): Promise<IErrorObj> => {
    try {
        const permissions = []
        if (addFollowers) {
            permissions.push(PERMISSIONS[0])
        }
        if (linkAuth) {
            permissions.push(PERMISSIONS[1])
        }

        const reqTwitterChallenge = await fetchWAuth(store, `${API_BASE}/oauth//2/twitter`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                permissions
            })
        });
        if (!reqTwitterChallenge.ok) {
            return { error: true, msg: "Error generating twitter challenge, please try again later.", stage: "initial" }
        }
        const { oauthChallenge: { _id: oauthChallengeId }, redirectPath } = await reqTwitterChallenge.json();
        window.open(redirectPath, "_blank");
        return await twitterAuthCheck(store, oauthChallengeId, cancel);

    } catch (err) {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
};

const twitterAuthCheck = async (
    store: IMainStore,
    oauthChallengeId: string,
    cancel: Ref<boolean>
): Promise<IErrorObj> => {
    try {
        const reqTwitterAuth = await fetch(
            `${API_BASE}/oauth/twitter/status?oauthChallengeId=${oauthChallengeId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
            }
        );
        const data = await reqTwitterAuth.json();
        if (data?.confirmed) {
            if (store.userData.connected) store.userData.connected.twitter = true
            return { error: false, msg: "Twitter account linked successfully.", stage: "success" }
        } else {
            await wait(350);
            if (cancel.value) {
                return { error: true, msg: "Twitter account linking cancelled.", stage: "initial" }
            }
            return await twitterAuthCheck(store, oauthChallengeId, cancel);
        }
    } catch {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
};


export const unlinkTwitter = async (store: IMainStore): Promise<IErrorObj> => {
    try {
        const resultP = fetchWAuth(store, `${API_BASE}/oauth/twitter`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const reqP = fetchWAuth(store, `${API_BASE}/web3-auth`, {
            method: 'DELETE',
            body: JSON.stringify({
                platforms: ['twitter']
            })
        })

        const [result, req] = await Promise.all([resultP, reqP])

        if (result.ok && req.ok) {
            if (store.userData.connected) store.userData.connected.twitter = false
            return { error: false, msg: "Twitter account unlinked successfully.", stage: "success" }
        }
        return { error: true, msg: "Error on unlinking Twitter account, please try again later.", stage: "initial" }
    }
    catch {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
}
