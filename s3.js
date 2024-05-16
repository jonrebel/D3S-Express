const S3 = require("aws-sdk/clients/s3")
require("dotenv").config()
const bucketName = process.env.BUCKET_NAME
const region = process.env.BUCKET_REGION
const accessKeyId = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

module.exports = {s3}