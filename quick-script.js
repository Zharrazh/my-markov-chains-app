import fs from 'fs';
import path from 'path';

const folders = ['src/entities/chain', 'src/entities/state', 'src/entities/transition'];

for (const folder of folders) {
  const dir = path.resolve(process.cwd(), folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created folder: ${folder}`);
  } else {
    console.log(`Folder already exists: ${folder}`);
  }
}
