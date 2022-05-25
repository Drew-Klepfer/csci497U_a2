// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const express = require("express");
const bodyParser = require("body-parser");
const { createGame, fetchGame, performMove, handlePostMoveNotification } = require("./data");
const {
  createCognitoUser,
  login,
  fetchUserByEmail,
  verifyToken
} = require("./auth");
const { validateCreateUser, validateCreateGame, validatePerformMove } = require("./validate");

const app = express();
app.use(bodyParser.json());

function wrapAsync(fn) {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
}
// Login
app.post("/login", wrapAsync(async (req, res) => {
  const idToken = await login(req.body.username, req.body.password);
  res.json({ idToken });
}));

// Create user
app.post("/users", wrapAsync(async (req, res) => {
  const validated = validateCreateUser(req.body);
  if (!validated.valid) {
    throw new Error(validated.message);
  }
  const user = await createCognitoUser(
    req.body.username,
    req.body.password,
    req.body.email
  );
  res.json(user);
}));

// Create new game
app.post("/games", wrapAsync(async (req, res) => {
  const validated = validateCreateGame(req.body);
  if (!validated.valid) {
    throw new Error(validated.message);
  }
  const token = await verifyToken(req.header("Authorization"));
  const opponent = await fetchUserByEmail(req.body.opponent);
  const creator = await fetchUserByEmail(token["cognito:username"]);
  const game = await createGame({
    creator: creator,
    opponent: opponent
  });
  res.json(game);
}));

// Fetch game
app.get("/games/:gameId", wrapAsync(async (req, res) => {
  const game = await fetchGame(req.params.gameId);
  res.json(game);
}));

// Perform move
app.post("/games/:gameId", wrapAsync(async (req, res) => {
  const validated = validatePerformMove(req.body);
  if (!validated.valid) {
    throw new Error(validated.message);
  }

  const token = await verifyToken(req.header("Authorization"));

  const game = await performMove({
    gameId: req.params.gameId,
    user: token["cognito:username"],
    changedIndex: req.body.changedIndex,
    playerMark: req.body.playerMark
  });
  
  let opponentUsername
  if (game.user1 !== game.lastMoveBy) {
    opponentUsername = game.user1
  } else {
    opponentUsername = game.user2
  }
  const opponent = await fetchUserByEmail(opponentUsername);
  const mover = {
    username: token['cognito:username'],
    email: token['email']
  }
  await handlePostMoveNotification({ game, mover, opponent })
  res.json(game);
}));

app.use(function(error, req, res, next) {
  res.status(400).json({ message: error.message });
});

module.exports = app;
