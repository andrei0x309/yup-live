import { Capacitor } from "@capacitor/core";

export const isAndroid = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'
