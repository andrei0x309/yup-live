import { fetchWAuth } from './../auth';
import { config } from '../config'
import type { IMainStore } from '../../types/store'
import { wait } from 'shared/src/utils/time'
import { IErrorObj } from 'shared/src/types/errorObj'

const { API_BASE } = config

export const claimAndLinkTwitter = async (store: IMainStore): Promise<IErrorObj> => {
    try {
        const reqTwitterChallenge = await fetch(`${API_BASE}/v1/auth/oauth-challenge`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: "twitter.com",
            }),
        });
        if (!reqTwitterChallenge.ok) {
            return { error: true, msg: "Error generating twitter challenge, please try again later.", stage: "initial" }
        }
        const {
            token: verificationToken,
            _id: verificationId,
        } = await reqTwitterChallenge.json();

        const reqTwitterAuth = await fetch(`${API_BASE}/v1/auth/twitter`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                verificationToken,
                verificationId,
                oauthReferrer: "onboarding",
            }),
        });
        if (!reqTwitterAuth.ok) {
            return { error: true, msg: "Error on auth of Twitter challenge, please try again later.", stage: "initial" }
        }
        const oauthRes = await reqTwitterAuth.json();
        window.open(oauthRes.redirectPath, "_blank");
        return await twitterAuthCheck(store, verificationId, verificationToken);

    } catch (err) {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
};

const twitterAuthCheck = async (
    store: IMainStore,
    verificationId: string,
    verificationToken: string
): Promise<IErrorObj> => {
    try {
        const reqTwitterAuth = await fetch(
            `${API_BASE}/v1/auth/oauth-challenge?verificationId=${verificationId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
            }
        );
        const data = await reqTwitterAuth.json();
        if (data?.confirmed) {
            const reqTwitterClaim = await fetchWAuth(store, `${API_BASE}/accounts/twitter/link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    verificationId,
                    verificationToken,
                }),
            });
            if (reqTwitterClaim.ok) {
                return { error: false, msg: "Twitter account linked successfully.", stage: "success" }
            } else {
                return { error: true, msg: "Error on linking Twitter account, please try again later.", stage: "initial" }
            }
        } else {
            await wait(350);
            return await twitterAuthCheck(store, verificationId, verificationToken);
        }
    } catch {
        return { error: true, msg: "Network Error API DOWN, please try again later.", stage: "initial" }
    }
};

export const twitterCheckAndUnlink = async (store: IMainStore): Promise<IErrorObj> => {
    try {
        const result = await fetchWAuth(store, `${API_BASE}/accounts/twitter/unlink`, {
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