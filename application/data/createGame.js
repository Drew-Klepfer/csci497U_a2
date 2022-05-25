// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require("uuid/v4");
const sendMessage = require("./sendMessage");

const createGame = async ({ creator, opponent }) => {
  const params = {
    TableName: "tic-tac-toe",
    Item: {
      gameId: uuidv4().split('-')[0],
      user1: creator,
      user2: opponent.username,
      gb1: null,
      gb2: null,
      gb3: null,
      gb4: null,
      gb5: null,
      gb6: null,
      gb7: null,
      gb8: null,
      gb9: null,
      lastMoveBy: creator,
      playerMark: "X"
    }
  };

  try {
    await documentClient.put(params).promise();
  } catch (error) {
    console.log("Error creating game: ", error.message);
    throw new Error("Could not create game");
  }

  const message = `Hi ${opponent.username}. Your friend ${creator} has invited you to a new game! Your game ID is ${params.Item.gameId}`;
  const source = `${creator.email}`;
  const dest = `${opponent.email}`;
  try {
    console.log("creator email: " + source);
    console.log("opponent email: " + dest);
    console.log("message: " + message);
    await sendMessage({ sourceEmail: source, destEmail: dest, message: message });
  } catch (error) {
    console.log("Error sending message: ", error.message);
    throw new Error("Could not send message to user " + error.message);
  }

  return params.Item;
};

module.exports = createGame;
