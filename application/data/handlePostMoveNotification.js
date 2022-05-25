// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const sendMessage = require('./sendMessage')

const handlePostMoveNotification = async ({ game, mover, opponent }) => {
  /* use tic-tac-toe logic to check winning possibilities */
  var gameOver = 0;
  var tie = 0;

  //row 1
  if (game.gb1 != "e" && game.gb1 == game.gb2 && game.gb1 == game.gb3) {
    gameOver = 1;
  } 
  //row 2
  if (game.gb4 != "e" && game.gb4 == game.gb5 && game.gb4 == game.gb6) {
    gameOver = 1;
  }  
  //row 3
  if (game.gb7 != "e" && game.gb7 == game.gb8 && game.gb7 == game.gb9) {
    gameOver = 1;
  } 
  //column 1
  if (game.gb1 != "e" && game.gb1 == game.gb4 && game.gb1 == game.gb7) {
    gameOver = 1;
  } 
  //column 2
  if (game.gb2 != "e" && game.gb2 == game.gb5 && game.gb2 == game.gb8) {
    gameOver = 1;
  } 
  //column 3
  if (game.gb3 != "e" && game.gb3 == game.gb6 && game.gb3 == game.gb9) {
    gameOver = 1;
  } 
  //diagonal top left bottom right
  if (game.gb1 != "e" && game.gb1 == game.gb5 && game.gb1 == game.gb9) {
    gameOver = 1;
  } 
  //diagonal bottom left top right
  if (game.gb3 != "e" && game.gb3 == game.gb5 && game.gb3 == game.gb7) {
    gameOver = 1;
  }


  /* winning condition met */
  if (gameOver == 1) {
    const winnerMessage = `You beat ${mover.email} in a game of tic-tac-toe!`
    const loserMessage = `Ahh, you lost to ${opponent.email} in tic-tac-toe.`
    await Promise.all([
      /* sendMessage({ phoneNumber: opponent.phoneNumber, message: winnerMessage }),
      sendMessage({ phoneNumber: mover.phoneNumber, message: loserMessage }) */
      sendMessage({ sourceEmail: `${mover.email}`, destEmail: `${opponent.email}`, message: winnerMessage }),
      sendMessage({ sourceEmail: `${opponent.email}`, destEmail: `${mover.email}`, message: loserMessage })
    ])

    return
  }

  if(game.gb1 != "e" && game.gb2 != "e" && game.gb3 != "e" && game.gb4 != "e" && game.gb5 != "e" && game.gb6 != "e" && game.gb7 != "e" && game.gb8 != "e" && game.gb9 != "e"){
    tie = 1;
  }

  /* tie condition met */
  if (tie == 1) {
    const tieOpponentMessage = `You drawed with ${mover.email} in tic-tac-toe!`
    const tieMoverMessage = `You drawed with ${opponent.email} in tic-tac-toe.`
    await Promise.all([
      /* sendMessage({ phoneNumber: opponent.phoneNumber, message: winnerMessage }),
      sendMessage({ phoneNumber: mover.phoneNumber, message: loserMessage }) */
      sendMessage({ sourceEmail: `${mover.email}`, destEmail: `${opponent.email}`, message: tieOpponentMessage }),
      sendMessage({ sourceEmail: `${opponent.email}`, destEmail: `${mover.email}`, message: tieMoverMessage })
    ])

    return
  }

  /* if last move was not winning move */
  const message = `${mover.email} has moved. It's your turn next in Game ID ${game.gameId}!`
  //await sendMessage({ phoneNumber: opponent.phoneNumber, message })
  await sendMessage({ sourceEmail: `${mover.email}`, destEmail: `${opponent.email}`, message })
};

module.exports = handlePostMoveNotification;