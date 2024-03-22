const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const ulid = require('ulid');

const { BUCKET_NAME } = process.env;

const s3Client = new S3Client({ useAccelerateEndpoint: true });

module.exports.handler = async (event) => {
  const id = ulid.ulid();
  let key = `${event.identity.username}/${id}`;

  const extension = event.arguments.extension;
  if (extension) {
    key += extension.startsWith('.') ? extension : `.${extension}`;
  }

  const contentType = event.arguments.contentType || 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    throw new Error('Invalid content type');
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ACL: 'public-read',
    ContentType: contentType,
  };

  console.log(`Generating signed URL with params [${JSON.stringify(params)}]`);

  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  console.log(`Generated signed URL [${signedUrl}] for key [${key}]`);
  return signedUrl;
};
