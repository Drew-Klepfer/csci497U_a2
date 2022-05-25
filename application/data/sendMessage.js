// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
const ses = new AWS.SES();
AWS.config.update({ region: 'us-west-2' })

const sendMessage = async ({ sourceEmail, destEmail, message }) => {

  var myMessage = message;
  var receiverEmail = destEmail;
  var emailSource = sourceEmail;

  JSON.stringify(myMessage);
  JSON.stringify(receiverEmail);
  JSON.stringify(emailSource);

  const params = {
    Destination: {
      ToAddresses: [receiverEmail]
    },
    Message: {
      Body: {
        Text: { Data: myMessage },
      },
      Subject: {
        Data: 'Tic-tac-toe game'
      }
    },
    Source: emailSource
  };

  return ses.sendEmail(params).promise();
};

module.exports = sendMessage;