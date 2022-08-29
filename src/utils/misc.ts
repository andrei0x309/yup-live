const gini = function (data: number[], unordered = true) {
    if (!Array.isArray(data)) {
        throw new Error("Data set is not an array.");
    }

    if (data.length <= 0) {
        throw new Error("Data set is an empty array.");
    }

    data = data.map(function (value) {
        value = Number(value);

        if (isNaN(value)) {
            throw new Error("Data set contains non-numbers.");
        }

        if (value < 0) {
            throw new Error("Data set contains negative numbers.");
        }

        return value;
    });

    let sum1 = 0;
    let sum2 = 0;
    if (unordered) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (i != j) {
                    sum1 += Math.abs(data[i] - data[j]);
                }
            }

            sum2 += data[i];
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            sum1 += ((2 * (i + 1)) - data.length - 1) * data[i];
            sum2 += data[i];
        }
    }


    if (sum2 == 0) {
        return 0;
    }

    return sum1 / (2 * Math.pow(data.length, 2) * (sum2 / data.length));
}

const convertToCSV = (arr: unknown[]) => {
    const array = typeof arr != 'object' ? JSON.parse(arr) : arr;
    let str = '';
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (const index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\n';
    }
    return str;
}

const exportFile = (fileName: string, content: string, type = 'csv') => {
    const link = document.createElement('a');
    const blob = new Blob([content], { type: `text/${type};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const getNormalizedValue = (val: number, min: number, max: number) => {
    return Math.floor(((val - min) / (max - min)) * 100);
}

const getMaxVote = (balance: number) => {
    return balance >= 100 ? 125 : balance >= 0.5 ? 95 : 65;
}

const makePercentage = (val: number) => {
    return `${val}%`;
}

const MAX_DELETE_VOTE = 600
const MAX_FOLLOW_USAGE = 60

const makeRandAvatar = (seed: string) => `https://avatars.dicebear.com/api/avataaars/${seed}.svg`

const makeRandomPreview = () => `/picsum/${Math.floor(Math.random() * 99)}.webp`

export {
    gini,
    exportFile,
    convertToCSV,
    getNormalizedValue,
    getMaxVote,
    MAX_DELETE_VOTE,
    MAX_FOLLOW_USAGE,
    makePercentage,
    makeRandAvatar,
    makeRandomPreview
}