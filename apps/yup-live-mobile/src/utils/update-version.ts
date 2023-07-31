import { getApp } from "@/utils/capacitor";
import { IMainStore } from "shared/src/types/store";
import { storage } from './storage'

const JSON_URL = 'https://jsonkeeper.com/b/FHJ5'
// const JSON_URL = 'https://yup-live.pages.dev/mobile/latest-version.json';


const parseVersionNumber = (version: string) => {
    const versionNumber = Number(version.replace(/\./g, ''));
    return versionNumber;
}

const getVersionNumber = async () => {
    try {
        const info = await getApp()?.getInfo();
        return parseVersionNumber(info?.version ?? '');
    } catch (error) {
        return null
    }
}

const getLastCheckForUpdate = async (store: IMainStore) => {
    const lastCheck = store?.settings?.lastCheckForUpdate ?? Date.now();
    return lastCheck;
}

const setUpdateStore = async ({
    store,
    currentVersion,
    forced,
    message,
    forcedMessage,
}: {
    store: IMainStore
    currentVersion: number | null
    forced: boolean
    message: string
    forcedMessage: string
}
) => {
    const lastCheck = Date.now();
    if (!currentVersion) return;
    if (store?.settings) {
        store.settings.lastCheckForUpdate = lastCheck;
        store.settings.forcedVersion = forced ? currentVersion : 0;
        store.settings.updateMessage = forced ? forcedMessage : message;
        await storage.set('settings', store.settings);
    }
}


const checkForUpdate = async ({ currentVersion }: { currentVersion: number | null }) => {
    const res = await fetch(JSON_URL);
    if (!res.ok) {
        return { update: false, isError: true, error: res?.statusText, forced: false, updateMessage: null, url: null }
    }
    try {
        const json = await res.json();
        if (!currentVersion) currentVersion = await getVersionNumber();
        if (!currentVersion) return { update: false, isError: true, error: 'Could not get current version', forced: false, updateMessage: null, url: null }
        const latestVersion = parseVersionNumber(json.version);
        return {
            update: latestVersion > currentVersion,
            isError: false,
            error: null,
            forced: json.forced,
            updateMessage: json.forced ? json.forcedMessage : json.message,
            url: json.url
        }
    } catch (error) {
        return { update: false, isError: true, error: String(error), forced: false, updateMessage: null, url: null }
    }

}

const checkIsForcedUpdate = async ({
    store,
    currentVersion
}: {
    store: IMainStore
    currentVersion: number | null
}) => {
    if (!currentVersion) return false;
    const forcedVersion = store?.settings?.forcedVersion ?? 0;
    return currentVersion === forcedVersion;
}


export const checkForUpdateAndNotify = async (store: IMainStore) => {
    const currentVersion = await getVersionNumber();
    const isForcedUpdate = await checkIsForcedUpdate({ store, currentVersion });
    if (isForcedUpdate) {
        return { update: true, isError: false, error: null, forced: true, updateMessage: store?.settings?.updateMessage ?? '', url: store?.settings?.updateUrl ?? '' }
    }
    const lastCheck = await getLastCheckForUpdate(store);
    const now = Date.now();
    if (now - lastCheck > 1000 * 60 * 60 * 24 * 1.5) {
        const res = await checkForUpdate({
            currentVersion
        });
        if (res.update) {
            await setUpdateStore({
                store,
                currentVersion,
                forced: res.forced,
                message: res.updateMessage,
                forcedMessage: res.updateMessage,
            });
            return res;
        }
    }
    return { update: false, isError: false, error: null, forced: false, updateMessage: null, url: null }
}
