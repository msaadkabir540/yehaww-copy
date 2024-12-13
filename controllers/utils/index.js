const { fileURLToPath } = require("url");
const fs = require("fs");
const AWS = require("aws-sdk");
const path = require("path");
const countryCityList = require("../../utils/json/countries+states+cities.json");

const getCities = async (req, res) => {
  const { country } = req.query;
  const citiesList = [];
  countryCityList
    ?.find((x) => x.name === country)
    ?.states.forEach((x) => citiesList.push(...x.cities.map((x) => x.name)));

  return res.status(200).send({ citiesList });
};

const downloadFile = (req, res) => {
  // configure the AWS SDK
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  // create an S3 client
  const s3 = new AWS.S3();
  // get the S3 file URL from the request query
  const s3Url = req.query.s3Url;

  s3.getObject(
    {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Url.substring(s3Url.lastIndexOf("/") + 1),
    },
    (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // save the file to the local filesystem
        fs.writeFile("yehaww-brochure.pdf", data.Body, (err) => {
          if (err) {
            console.error(err);
          } else {
            const filepath = path.resolve(__dirname, "..", "..", "yehaww-brochure.pdf");
            res.download(filepath, "yehaww-brochure.pdf", () => {
              fs.unlinkSync(filepath);
            });
          }
        });
      }
    }
  );
};

module.exports = { getCities, downloadFile };
