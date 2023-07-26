import { IMainStore } from 'shared/src/types/store';
import { storage } from './storage';
import { fetchWAuth } from 'shared/src/utils/auth';
import { useRouter } from 'vue-router';
import { isAndroid } from './capacitor';

const API_BASE = import.meta.env.VITE_YUP_API_BASE;

export const PUSH_NOTIFICATION_TYPES = ['follow', 'reward', 'vote', 'comment', 'mention', 'repost']

function generateUUID () {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    });
}

const genInstallationId = async () => {
    const id = generateUUID().toLowerCase()
    console.log(id, 'id')
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
        pushToken
    }
    const req = await fetchWAuth(store, endPoint, {
        method: 'POST',
        body: JSON.stringify(body),
    })

    return req.ok
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
    const { PushNotifications } = await import('@capacitor/push-notifications');

    const deviceId = await getInstallationId()
    console.log(deviceId, 'deviceId')
    try {
    const devicePushTokenP = new Promise((resolve, reject) => {
        PushNotifications.addListener('registration', (token) => {
            console.log('Push registration success, token: ' + token.value);
            resolve(token.value)
        });
    })

    await PushNotifications.createChannel({
        id: 'default',
        name: 'Yup Live',
        description: 'Yup Live notifications',
        importance: 5,
        visibility: 1,
        sound: 'default',
        vibration: true,
        lightColor: 'FF0000',
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed: ' + notification);
        useRouter().push('/tabs/notifications')
    }
    );

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
    }
    await PushNotifications.register()
    const devicePushToken = await devicePushTokenP
    console.log(devicePushToken, 'devicePushToken')
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
            console.log(body)
        } catch {
            // do nothing
        }
        throw new Error('Error fetching Expo push token: ' + statusInfo + ' Body: ' + body);
    }

    const data = await response.json();
    const { expoPushToken } = data.data;
    sendPushToken({ store, pushToken: expoPushToken, deviceId })
    return data
    } catch {
        console.info('Push notifications not available on Web Platform')
    }
}