
import { UpdateReceipeRequest } from '../requests/UpdateReceipeRequest'

import * as AWS  from 'aws-sdk'



const docClient = new AWS.DynamoDB.DocumentClient()
const receipesTable = process.env.RECEIPES_TABLE
//const  bucketName = process.env.IMAGES_S3_BUCKET
const createdAtIndex = process.env.CREATED_AT_INDEX



export async function createReceipe(newItem: any) {


  console.log('Storing new item: ', newItem)
   await docClient
    .put({
      TableName: receipesTable,
      Item: newItem
    })
    .promise()
  
  
 

}

export async function deleteReceipe(userId: string, receipeId: string) {
    await docClient.delete({
    TableName: receipesTable,
    Key:{
      userId:userId,
      receipeId:receipeId
    }
    
  }).promise()

}

export async function updateReceipe(userId: string, receipeId: string, updatedReceipe: UpdateReceipeRequest){
  
    await docClient.update({
    TableName: receipesTable,
    Key:{
      userId:userId,
      todoId:receipeId
    },
    
    UpdateExpression: "set #name = :name, #ingredients = :ingredients",
    ExpressionAttributeNames: {'#name':'name', '#ingredients':'ingredients'}
,
    ExpressionAttributeValues: {
      ":name": updatedReceipe.name,
      ":ingredients": updatedReceipe.ingredients
    }
  }).promise()

}

export async function getReceipes(userId: string): Promise<any>{
const result  =  await docClient.query({
    TableName:receipesTable,
    IndexName:createdAtIndex,
    KeyConditionExpression:'userId = :userId',
    ExpressionAttributeValues:{
      ':userId':userId
    },
  }).promise()

  
const items = result.Items
  return items
}



