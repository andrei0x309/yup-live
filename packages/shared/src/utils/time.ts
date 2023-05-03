import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const timeAgo = (time: string) => {
    return dayjs(time).fromNow()
}

export const wait = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const getTimeRemaining = (endtime: Date) => {
    const t = Date.parse(endtime.toISOString()) - Date.parse(new Date().toISOString())
    return {
        'total': t,
        'days': Math.floor(t / (1000 * 60 * 60 * 24)),
        'hours': Math.floor((t / (1000 * 60 * 60)) % 24),
        'minutes': Math.floor((t / 1000 / 60) % 60),
        'seconds': Math.floor((t / 1000) % 60)
    };
}