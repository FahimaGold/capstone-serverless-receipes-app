
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateReceipeRequest } from '../../requests/CreateReceipeRequest'

//import * as AWS  from 'aws-sdk'

import * as uuid from 'uuid'

import {createReceipeItem} from '../../businessLogic/receipes'



const  bucketName = process.env.IMAGES_S3_BUCKET
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  
  // TODO: Implement creating a new TODO item
  console.log('Processing event: ', event)
  const itemId = uuid.v4()
 
  let userId = event.requestContext.authorizer['principalId']; 
  const newReceipe: CreateReceipeRequest = JSON.parse(event.body)
  const newItem = {
    userId,
    itemId,
    ...newReceipe,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
    createdAt:new Date().toISOString()

  }
 
const  createdReceipe = await createReceipeItem(newItem, userId, itemId)
 
 try{
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item :{
        ...createdReceipe,
      }
    })
  }
}


catch(e){
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({e})
  }

  }
}

  

