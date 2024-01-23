// import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime'

// dayjs.extend(relativeTime)


export const timeAgo = (date: string) => {

    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    let intervalType: string;

    if (interval >= 1) {
        intervalType = 'year';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'month';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'day';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "hour";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "minute";
                    } else {
                        interval = seconds;
                        intervalType = "second";
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        intervalType += 's';
    }

    return interval.toFixed(0) + ' ' + intervalType + ' ago';
}


// export const timeAgo = (time: string) => {
//     return dayjs(time).fromNow()
// }

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