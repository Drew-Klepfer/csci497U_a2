// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require("aws-sdk");
//const sns = new AWS.SNS();
const ses = new AWS.SES();
AWS.config.update({region: 'us-west-2'})

const sendMessage = async ({ sourceEmail, destEmail, message }) => {
  const params = {
    Destination: {
      ToAddresses: [
        destEmail
      ]
    },
    Message: {
      Body: {
        Text: {
          Data: message
        },
      },
      Subject: {
        Data: 'Tic-tac-toe game'
      }
    },
    Source: sourceEmail
  };

  return ses.sendEmail(params).promise();
};

module.exports = sendMessage;
