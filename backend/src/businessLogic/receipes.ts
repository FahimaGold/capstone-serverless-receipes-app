import {createReceipe, deleteReceipe, updateReceipe, getReceipes} from '../dbAccess/receipesAccess'

import { CreateReceipeRequest } from '../requests/CreateReceipeRequest'
import { UpdateReceipeRequest } from '../requests/UpdateReceipeRequest'

const  bucketName = process.env.IMAGES_S3_BUCKET

export async function createReceipeItem(newReceipe: CreateReceipeRequest, userId: string, receipeId: string) {
 
  const newItem = {
    userId,
    receipeId,
    ...newReceipe,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${receipeId}`,
    createdAt:new Date().toISOString(),
    done:false

  }
  console.log('Storing new item: ', newItem)
 await createReceipe(newItem)
  return newItem
}

export async function deleteReceipeItem(userId: string, receipeId: string){
  console.log('deleting item: ', receipeId)
  await deleteReceipe(userId, receipeId)
}


export async function updateReceipeItem(userId: string, receipeId: string, updatedReceipe: UpdateReceipeRequest){
  console.log('updating item: ', receipeId)
  await updateReceipe(userId, receipeId, updatedReceipe)
}

export async function getReceipeItems(userId: string) {
 
  console.log('Getting items for user: ', userId)
 const items = await getReceipes(userId)
  return items
}
