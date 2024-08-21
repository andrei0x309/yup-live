import { IMainStore } from 'shared/src/types/store';
import { storage } from './storage';
import { fetchWAuth } from 'shared/src/utils/auth';
import { useRouter } from 'vue-router';
import { isAndroid } from './capacitor';
import { Device } from '@capacitor/device';


const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const PUSH_NOTIFICATION_TYPES = ['follow', 'vote', 'comment', 'mention', 'repost']

async function generateUUIDFromString (inputString: string) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode('6ba7b810-9dad-11d1-80b4-00c04fd430c8' + inputString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    const uuid = [
        hashHex.substr(0, 8),
        hashHex.substr(8, 4),
        '5' + hashHex.substr(13, 3),
        '8' + hashHex.substr(16, 3),
        hashHex.substr(19, 12)
    ].join('-');

    return uuid;
}

const genInstallationId = async () => {
    const id = await generateUUIDFromString((await Device.getId()).identifier)
    await storage.set('installationId', id)
    return id
}

export const getInstallationId = async () => {
    const id = await storage.get('installationId')
    if (!id) {
        return genInstallationId()
    }
    return id
}

const productionBaseUrl = 'https://exp.host/--/api/v2/';

const projectId = "72e4e4a3-32e0-4040-8566-2678e42f8f6a"
const applicationId = 'gf.yup.info'
const type = 'fcm'
const development = false

const sendPushToken = async ({ store,
    pushToken,
    deviceId,
}: {
    store: IMainStore
    pushToken: string
    deviceId: string
}) => {
    const endPoint = `${API_BASE}/push-token`
    const body = {
        deviceId,
        token: pushToken
    }
    const req = await fetchWAuth(store, endPoint, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return req.ok
}

const getPushTokens = async ({ store }: { store: IMainStore }) => {
    const endPoint = `${API_BASE}/push-token`
    const req = await fetchWAuth(store, endPoint, {
        method: 'GET',
    })

    if (!req.ok) {
        return false
    }

    const data = await req.json()
    return data
}

const clearPushTokens = async ({ store }: { store: IMainStore }) => {
    const endPoint = `${API_BASE}/push-token`
    const req = await fetchWAuth(store, endPoint, {
        method: 'DELETE',
    })

    return req.ok
}

export const checkClearPushTokens = async ({ store }: { store: IMainStore }) => {
    try {
        const tokens = await getPushTokens({ store })
        if (tokens && tokens.length > 2) {
            await clearPushTokens({ store })
        }
    }
    catch (e) {
        console.error(e)
    }
}

export const getPushSettings = async ({ store }: { store: IMainStore }) => {
    const endPoint = `${API_BASE}/push-notification/settings`
    const req = await fetchWAuth(store, endPoint, {
        method: 'GET',
    })

    if (!req.ok) {
        return false
    }

    const data = await req.json()
    return data
}

export const setPushSettings = async ({ store, notificationTypes }: { store: IMainStore, notificationTypes: string[] }) => {
    const endPoint = `${API_BASE}/push-notification/settings`
    const body = {
        notificationTypes
    }
    const req = await fetchWAuth(store, endPoint, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    if (!req.ok) {
        return false
    }

    const data = await req.json()
    return data
}

export const getExpoPushTokenAndRegister = async ({ store }: { store: IMainStore }) => {
    if (!isAndroid()) {
        return
    }
    const { FirebaseMessaging } = await import('@capacitor-firebase/messaging')

    let permStatus = await FirebaseMessaging.checkPermissions();

    if (permStatus.receive === 'prompt') {
        permStatus = await FirebaseMessaging.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
    }

    // const { PushNotifications } = await import('@capacitor/push-notifications');

    const deviceId = await getInstallationId()
    try {
        // const devicePushTokenP = new Promise((resolve, reject) => {
        //     FirebaseMessaging.addListener('registration', (token) => {
        //         console.log('Push registration success, token: ' + token.value);
        //         resolve(token.value)
        //     });
        // })
        const devicePushToken = (await FirebaseMessaging.getToken()).token;

        await FirebaseMessaging.createChannel({
        id: 'default',
        name: 'Yup Live',
        description: 'Yup Live notifications',
        importance: 5,
        visibility: 1,
        sound: 'default',
        vibration: true,
        lightColor: 'FF0000',
    });

        await FirebaseMessaging.addListener('notificationReceived', notification => {
        console.log('Push notification received: ', notification);
    });

        await FirebaseMessaging.addListener('notificationActionPerformed', notification => {
        console.log('Push notification action performed: ' + notification);
        useRouter().push('/tabs/notifications')
    }
    );

        console.info(devicePushToken, 'devicePushToken')
    const body = {
        type,
        deviceId,
        development,
        appId: applicationId,
        deviceToken: devicePushToken,
        projectId,
    };

    const url = `${productionBaseUrl}push/getExpoPushToken`;
    const proxyURl = 'https://corsproxy.io/?' + encodeURIComponent(url);


    const response = await fetch(proxyURl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(body),
    }).catch((error) => {
        console.error(error)
        throw error
    });

    console.info(response)

    if (!response.ok) {
        const statusInfo = response.statusText || response.status;
        let body: string | undefined = undefined;
        try {
            body = await response.text();
        } catch {
            // do nothing
        }
        throw new Error('Error fetching Expo push token: ' + statusInfo + ' Body: ' + body);
    }

    const data = await response.json();
    const { expoPushToken } = data.data;
        console.info('Expo push token: ' + expoPushToken);
        await checkClearPushTokens({ store })
    sendPushToken({ store, pushToken: expoPushToken, deviceId })
    return data
    } catch {
        console.info('Push notifications not available on Web Platform')
    }
}