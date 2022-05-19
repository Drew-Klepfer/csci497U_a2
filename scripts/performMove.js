// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient()

const performMove = async ({ gameId, user, changedIndex}) => {
  if (changedHeapValue < 0 ) {
    throw new Error('Cannot set heap value below 0')
  }
  const params = {
    TableName: 'tic-tac-toe',
    Key: { 
      gameId: gameId
    },
    UpdateExpression: `SET lastMoveBy = :user, ${changedIndex} = :changedHeapValue`,
    ConditionExpression: `(user1 = :user OR user2 = :user) AND lastMoveBy <> :user AND ${changedIndex} > :changedHeapValue`,
    ExpressionAttributeValues: {
      ':user': user,
      ':changedHeapValue': changedHeapValue,
    },
    ReturnValues: 'ALL_NEW'
  }
  try {
    const resp = await documentClient.update(params).promise()
    console.log('Updated game: ', resp.Attributes)
  } catch (error) {
    console.log('Error updating item: ', error.message)
  }
}

performMove({ gameId: '5b5ee7d8', user: 'theseconduser', changedHeap: 'heap1', changedHeapValue: 3 })
