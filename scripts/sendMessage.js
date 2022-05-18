// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const ses = new AWS.SES();

const sendMessage = async ({ sourceEmail, destEmail, message }) => {
  const params = {
    Destination: {
      ToAddresses: [destEmail]
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
    Source: 'zunkerb@wwu.edu'
  };

  return ses.sendEmail(params).promise();
};

sendMessage({ sourceEmail: 'zunkerb@wwu.edu' , destEmail: 'zunkerb@wwu.edu', message: 'Hello!' })
  .then(() => console.log('Sent message successfully'))
  .catch((error) => console.log('Error sending SES: ', error.message))