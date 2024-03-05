// const AWS = require('aws-sdk');


// exports.uploadToS3 = async (data, filename) => {
//     const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
//     const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
//     const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

//     let s3bucket = new AWS.S3({
//         accessKeyId: IAM_USER_KEY,
//         secretAccessKey: IAM_USER_SECRET
//     })

//     var params = {
//         Bucket: BUCKET_NAME,
//         Key: filename,
//         Body: data,
//         ACL: 'public-read'
//     }
//     try {
//         const s3response = await s3bucket.upload(params).promise();
//         console.log('Success', s3response);
//         return s3response.Location;
//     }
//     catch (err) {
//         console.error('Something went wrong.', err);
//         throw err;
//     }

// }