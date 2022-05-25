// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
AWS.config.update({region: 'us-west-2'});
const documentClient = new AWS.DynamoDB.DocumentClient();

const performMove = async ({ gameId, user, changedIndex, playerMark}) => {
  if (changedIndex < 1 || changedIndex > 9) {
    throw new Error('Desired index out of bounds')
  }
  const params = {
    TableName: "tic-tac-toe",
    Key: {
      gameId: gameId
    },
    UpdateExpression: `SET lastMoveBy = :user, gb${changedIndex} = :playerMark`,
    ConditionExpression: `(user1 = :user OR user2 = :user) AND lastMoveBy <> :user`,
    ExpressionAttributeValues: {
      ":user": user,
      ":playerMark": playerMark
    },
    ReturnValues: "ALL_NEW"
  };
  try {
    const resp = await documentClient.update(params).promise();
    console.log('Updated game: ', resp.Attributes);
    return resp.Attributes;
  } catch (error) {
    console.log("Error updating item: ", error.message);
    throw new Error('Could not perform move')
  }
};

module.exports = performMove