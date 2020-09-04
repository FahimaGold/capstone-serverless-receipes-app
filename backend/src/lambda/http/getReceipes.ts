import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {getReceipeItems} from '../../businessLogic/receipes'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  
  let userId = event.requestContext.authorizer['principalId'];
  console.log('Processing event: ' , event)
 

  
const items = await  getReceipeItems(userId)

return {
  statusCode:200,
  headers:{
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    items
  })
}
}
