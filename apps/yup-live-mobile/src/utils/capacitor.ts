import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

export const isAndroid = () => Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'
export const getApp = () => isAndroid() ? App : null