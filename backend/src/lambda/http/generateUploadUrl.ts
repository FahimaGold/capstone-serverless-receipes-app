import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


const s3 = new AWS.S3({
  signatureVersion:'v4',
  region:'us-east-1',
  params:{Bucket: process.env.IMAGES_S3_BUCKET}
})
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const receipeId = event.pathParameters.receipeId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const singedUrlExpireSeconds = 300
  const url = s3.getSignedUrl('putObject',{
    Bucket: process.env.IMAGES_S3_BUCKET,
    Key:receipeId,
    Expires: singedUrlExpireSeconds
  })
  return {
    statusCode:201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl:url
    })
  }
}


