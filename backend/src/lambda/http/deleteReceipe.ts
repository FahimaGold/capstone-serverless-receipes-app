import 'source-map-support/register'

import {deleteReceipeItem} from '../../businessLogic/receipes'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUserId } from '../utils'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const receipeId = event.pathParameters.receipeId

  // TODO: Remove a TODO item by 
  const userId = getUserId(event)
  await deleteReceipeItem(userId, receipeId)
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ""
   
  }
}
