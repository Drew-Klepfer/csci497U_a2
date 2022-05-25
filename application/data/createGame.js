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
      user1: creator.username,
      user2: opponent.username,
      gb1: "e",
      gb2: "e",
      gb3: "e",
      gb4: "e",
      gb5: "e",
      gb6: "e",
      gb7: "e",
      gb8: "e",
      gb9: "e",
      lastMoveBy: creator.username
    }
  };

  try {
    await documentClient.put(params).promise();
  } catch (error) {
    console.log("Error creating game: ", error.message);
    throw new Error("Could not create game");
  }

  const message = `Hi ${opponent.username}. Your friend ${creator.username} has invited you to a new game! Your game ID is ${params.Item.gameId}`;
  const source = `${creator.email}`;
  const dest = `${opponent.email}`;
  try {

    //testing
    /* console.log("creator email: " + source);
    console.log("opponent email: " + dest);
    console.log("message: " + message); */

    await sendMessage({ sourceEmail: source, destEmail: dest, message: message });
  } catch (error) {
    console.log("Error sending message: ", error.message);
    throw new Error("Could not send message to user " + error.message);
  }

  return params.Item;
};

module.exports = createGame;
