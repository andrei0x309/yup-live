import { isAndroid } from "@/utils/capacitor";
import { IMainStore } from "shared/src/types/store";
import { storage } from './storage'

const TEST_VERSION = '1.1.23'
// const JSON_URL = 'https://api.npoint.io/35bd47edaceb4d7bdf53';
const JSON_URL = 'https://yup-live.pages.dev/mobile/latest-version.json';

const isGreaterVersion = (version: string, otherVersion: string) => {
    const numbers = version.split('.').map(Number);
    const otherNumbers = otherVersion.split('.').map(Number);

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > otherNumbers[i]) return true;
        if (numbers[i] < otherNumbers[i]) return false;
    }
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
            }
        }
        return {
            versionString: TEST_VERSION,
        }
    } catch {
        return {
            versionString: TEST_VERSION,
        }
    }
}

const getLastCheckForUpdate = (settingsStorage: IMainStore['settings']) => {
    return settingsStorage?.lastCheckForUpdate ?? 0;
}

const setUpdateStore = async ({
    store,
    currentVersion,
    forced,
    message,
    forcedMessage,
}: {
    store: IMainStore
        currentVersion: string | null
    forced: boolean
    message: string
    forcedMessage: string
}
) => {
    if (!currentVersion) return;
    if (store?.settings) {
        store.settings.lastCheckForUpdate = Date.now();
        store.settings.forcedVersion = forced ? currentVersion : '';
        store.settings.updateMessage = forced ? forcedMessage : message;
        await storage.set('settings', { ...store.settings });
    }
}

export const unsetLastCheckForUpdate = async (store: IMainStore) => {
    if (store?.settings && store?.settings?.lastCheckForUpdate) {
        store.settings.lastCheckForUpdate = 0;
        await storage.set('settings', { ...store.settings });
    }
}


const checkForUpdate = async ({ currentVersion }: { currentVersion: string | null }) => {
    try {
        const res = await fetch(JSON_URL);
        if (!res.ok) {
            return { update: false, isError: true, error: res?.statusText, forced: false, updateMessage: null, url: null }
        }

        const json = await res.json();
        console.info('json', JSON.stringify(json));
        if (!currentVersion) currentVersion = (await getVersion()).versionString;
        if (!currentVersion) return { update: false, isError: true, error: 'Could not get current version', forced: false, updateMessage: null, url: null, paused: false }
        const latestVersion = (json.version);
        console.info('update', isGreaterVersion(latestVersion, currentVersion));
        return {
            update: isGreaterVersion(latestVersion, currentVersion),
            isError: false,
            error: null,
            forced: json.forced,
            updateMessage: json.forced ? json.forcedMessage : json.message,
            url: json.url,
            paused: !!json?.paused
        }
    } catch (error) {
        console.error(error);
        return { update: false, isError: true, error: String(error), forced: false, updateMessage: null, url: null, paused: false }
    }

}

const checkIsForcedUpdate = ({
    settingsStorage,
    currentVersion
}: {
        settingsStorage: IMainStore['settings']
        currentVersion: string | null
}) => {
    if (!currentVersion) return false;
    return currentVersion === (settingsStorage?.forcedVersion ?? '')
}

const checkIsPause = (settingsStorage: IMainStore['settings']) => {
    return settingsStorage?.updatePaused ?? false;
}

export const checkForUpdateAndNotify = async (store: IMainStore, currentVersionString: string | undefined) => {
    // await unsetLastCheckForUpdate(store);
    currentVersionString = currentVersionString ?? (await getVersion()).versionString;
    const settingsStorage = await storage.get("settings");

    if (checkIsPause(settingsStorage)) {
        return { update: false, isError: false, error: null, forced: false, updateMessage: null, url: null, paused: true }
    }

    const isForcedUpdate = checkIsForcedUpdate({ settingsStorage, currentVersion: currentVersionString });
    if (isForcedUpdate) {
        return { update: true, isError: false, error: null, forced: true, updateMessage: store?.settings?.updateMessage ?? '', url: store?.settings?.updateUrl ?? '', paused: false }
    }
    const lastCheck = getLastCheckForUpdate(settingsStorage);
    const now = Date.now();

    if (now - lastCheck > 216e5) {
        const res = await checkForUpdate({
            currentVersion: currentVersionString
        });
        if (res.update) {
            await setUpdateStore({
                store,
                currentVersion: currentVersionString,
                forced: res.forced,
                message: res.updateMessage,
                forcedMessage: res.updateMessage,
            });
            return res;
        }
        return { update: false, isError: false, error: null, forced: false, updateMessage: null, url: null, paused: false }
    }
    return { update: false, isError: false, error: null, forced: false, updateMessage: null, url: null, paused: false }
}
