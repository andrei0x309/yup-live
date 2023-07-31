import fs from 'node:fs';
import path from 'node:path';

const incVersion = (version: string) => {
    const [major, minor, patch] = version.split('.').map((v) => parseInt(v));
    return `${major}.${minor}.${patch + 1}`;
}

const androidVersionFilePath = path.join('android', 'app', 'build.gradle');
const readAndroidVersionFile = fs.readFileSync(androidVersionFilePath, 'utf8');
const androidVersionFile = readAndroidVersionFile.split('\n');
const androidVersionLine = androidVersionFile.find((line) =>
    line.includes('versionName')
);
if (!androidVersionLine) {
    throw new Error('Android version not found');
}
const androidVersion = androidVersionLine.split(' ')[1];
const androidversionName = androidVersion.replace('versionName', '').trim();
const newAndroidVersion = incVersion(androidversionName);
const newAndroidVersionLine = androidVersionLine.replace(
    androidversionName,
    newAndroidVersion
);
const newAndroidVersionFile = androidVersionFile.map((line) =>
    line === androidVersionLine ? newAndroidVersionLine : line
);
fs.writeFileSync(androidVersionFilePath, newAndroidVersionFile.join('\n'));
const jsonUpdatePath = path.join('../yup-live', 'public', 'mobile', 'preview-latest-version.json');
const readJsonUpdateFile = fs.readFileSync(jsonUpdatePath, 'utf8');
const jsonUpdateFile = JSON.parse(readJsonUpdateFile);
jsonUpdateFile.version = androidversionName;
fs.writeFileSync(jsonUpdatePath, JSON.stringify(jsonUpdateFile, null, 2));
console.log('Updated Mobile version to', androidversionName);
