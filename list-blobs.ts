import { list } from '@vercel/blob';
import * as dotenv from 'dotenv';
dotenv.config();

async function listBlobs() {
  const { blobs } = await list();
  console.log(JSON.stringify(blobs, null, 2));
}

listBlobs().catch(console.error);
