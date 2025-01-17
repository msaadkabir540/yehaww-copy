const AWS = require("aws-sdk");

const s3Bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  params: {
    Bucket: process.env.AWS_BUCKET_NAME,
  },
});

module.exports = { s3Bucket };
