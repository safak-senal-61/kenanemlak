import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.DO_SPACES_REGION || 'fra1',
  endpoint: process.env.DO_SPACES_ENDPOINT,
  forcePathStyle: false, // DigitalOcean için genellikle false olmalı, ama bazı durumlarda true gerekebilir.
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export default s3Client;
