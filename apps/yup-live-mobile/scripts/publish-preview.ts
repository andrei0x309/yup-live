import fs from 'fs';
import path from 'path';

const jsonPreviewPath = path.join('../yup-live', 'public', 'mobile', 'preview-latest-version.json');
const jsonReleasePath = path.join('../yup-live', 'public', 'mobile', 'latest-version.json');

fs.writeFileSync(jsonReleasePath, fs.readFileSync(jsonPreviewPath, 'utf8'));
console.log('Published update version to', jsonReleasePath);

