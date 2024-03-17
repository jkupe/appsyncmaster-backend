require('dotenv').config();
const AWS = require('aws-sdk');

const user_exists_in_UsersTable = async (id) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

  console.log(`Checking if user [${id}] exists in [${process.env.USERS_TABLE}]`);

  const response = await ddb.get({
    TableName: process.env.USERS_TABLE,
    Key: {
      id
    }
  }).promise();

  expect(response.Item).toBeTruthy();

  console.log(response);
  return response.Item;
}


module.exports = {
  user_exists_in_UsersTable
}