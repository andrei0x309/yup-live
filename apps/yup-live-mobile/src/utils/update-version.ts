import { isAndroid } from "@/utils/capacitor";
import { IMainStore } from "shared/src/types/store";
import { storage } from './storage'

const TEST_VERSION = '1.1.23'
// const JSON_URL = 'https://api.npoint.io/35bd47edaceb4d7bdf53';
const JSON_URL = 'https://yup-live.pages.dev/mobile/latest-version.json';


const parseVersionNumber = (version: string) => {
    const versionNumber = Number(version.replace(/\./g, ''));
    return versionNumber;
}

export const getVersion = async () => {
    try {
        let info: { version: string } | undefined;
        if (isAndroid()) {
            const { App } = await import("@capacitor/app");

            info = isAndroid() ? await App.getInfo() : undefined;
        }

        if (info?.version) {
            return {
                versionString: info?.version,
                versionNumber: parseVersionNumber(info?.version),
            }
        }
        return {
            versionString: TEST_VERSION,
            versionNumber: parseVersionNumber(TEST_VERSION),
        }
    } catch {
        return {
            versionString: TEST_VERSION,
            versionNumber: parseVersionNumber(TEST_VERSION),
        }
    }
}

const getLastCheckForUpdate = async (store: IMainStore) => {
    const lastCheck = store?.settings?.lastCheckForUpdate ?? 0;
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
        await storage.set('settings', { ...store.settings });
    }
}

export const unsetLastCheckForUpdate = async (store: IMainStore) => {
    if (store?.settings && store?.settings?.lastCheckForUpdate) {
        store.settings.lastCheckForUpdate = undefined;
        await storage.set('settings', { ...store.settings });
    }
}


const checkForUpdate = async ({ currentVersion }: { currentVersion: number | null }) => {
    try {
        console.info('checkForUpdate', JSON_URL);
        const res = await fetch(JSON_URL);
        if (!res.ok) {
            return { update: false, isError: true, error: res?.statusText, forced: false, updateMessage: null, url: null }
        }

        const json = await res.json();
        console.info('json', JSON.stringify(json));
        if (!currentVersion) currentVersion = (await getVersion()).versionNumber;
        if (!currentVersion) return { update: false, isError: true, error: 'Could not get current version', forced: false, updateMessage: null, url: null }
        const latestVersion = parseVersionNumber(json.version);
        console.info('update', latestVersion > currentVersion)
        return {
            update: latestVersion > currentVersion,
            isError: false,
            error: null,
            forced: json.forced,
            updateMessage: json.forced ? json.forcedMessage : json.message,
            url: json.url
        }
    } catch (error) {
        console.error(error);
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


export const checkForUpdateAndNotify = async (store: IMainStore, currentVersion: number | undefined) => {
    // await unsetLastCheckForUpdate(store);
    currentVersion = currentVersion ?? (await getVersion()).versionNumber;
    const isForcedUpdate = await checkIsForcedUpdate({ store, currentVersion });
    if (isForcedUpdate) {
        return { update: true, isError: false, error: null, forced: true, updateMessage: store?.settings?.updateMessage ?? '', url: store?.settings?.updateUrl ?? '' }
    }
    const lastCheck = await getLastCheckForUpdate(store);
    const now = Date.now();
    if (now - lastCheck > 1000 * 60 * 60 * 6) {
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
        return { update: false, isError: false, error: null, forced: false, updateMessage: null, url: null }
    }
    return { update: false, isError: false, error: null, forced: false, updateMessage: null, url: null }
}
