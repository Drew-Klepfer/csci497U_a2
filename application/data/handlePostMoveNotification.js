// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const sendMessage = require('./sendMessage')

const handlePostMoveNotification = async ({ game, mover, opponent }) => {
  // Handle when game is finished
  /* use tic-tac-toe logic to check winning possibilities */
  if (game.heap1 == 0 && game.heap2 == 0 && game.heap3 == 0) {
    const winnerMessage = `You beat ${mover.email} in a game of Nim!`
    const loserMessage = `Ahh, you lost to ${opponent.email} in Nim.`
    await Promise.all([
      /* sendMessage({ phoneNumber: opponent.phoneNumber, message: winnerMessage }),
      sendMessage({ phoneNumber: mover.phoneNumber, message: loserMessage }) */
      sendMessage({ sourceEmail: mover.email, destEmail: opponent.email, message: winnerMessage }),
      sendMessage({ sourceEmail: opponent.email, destEmail: mover.email, message: loserMessage })
    ])

    return
  }
  /* if last move was not winning move */
  const message = `${mover.email} has moved. It's your turn next in Game ID ${game.gameId}!`
  //await sendMessage({ phoneNumber: opponent.phoneNumber, message })
  await sendMessage({ sourceEmail: mover.email, destEmail: opponent.email, message })
};

module.exports = handlePostMoveNotification;