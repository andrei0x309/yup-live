import { fetchWAuth } from './../auth';
import { config } from '../config'
import type { IMainStore } from '../../types/store'
import { wait } from 'shared/src/utils/time'
import { IErrorObj } from 'shared/src/types/errorObj'

const { API_BASE } = config

const PERMISSIONS = ['addFollowers', 'addOAuthCredentials']

export const linkTwitter = async (store: IMainStore, addFollowers = false, linkAuth = true): Promise<IErrorObj> => {
    try {
        const permissions = []
        if (addFollowers) {
            permissions.push(PERMISSIONS[0])
        }
        if (linkAuth) {
            permissions.push(PERMISSIONS[1])
        }

        const reqTwitterChallenge = await fetchWAuth(store, `${API_BASE}/oauth/twitter`, {
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
        return await twitterAuthCheck(store, oauthChallengeId);

    } catch (err) {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
};

const twitterAuthCheck = async (
    store: IMainStore,
    oauthChallengeId: string,
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
            return { error: false, msg: "Twitter account linked successfully.", stage: "success" }
        } else {
            await wait(350);
            return await twitterAuthCheck(store, oauthChallengeId);
        }
    } catch {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
};

export const unlinkTwitter = async (store: IMainStore): Promise<IErrorObj> => {
    try {
        const result = await fetchWAuth(store, `${API_BASE}/oauth/twitter`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (result.ok) {
            return { error: false, msg: "Twitter account unlinked successfully.", stage: "success" }
        }
        return { error: true, msg: "Error on unlinking Twitter account, please try again later.", stage: "initial" }
    }
    catch {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
}
