const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const Chance = require('chance');
const chance = new Chance();

const { USERS_TABLE } = process.env

module.exports.handler = async (event) => {
  const ddbClient = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(ddbClient);

  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const name = event.request.userAttributes.name;
    const suffix = chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true });
    const screenName = `${name.replace(/[^a-zA-Z0-9]/g, "")}${suffix}`
    const user = {
      id: event.userName,
      name,
      screenName,
      createdAt: new Date().toISOString(),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
    }

    await docClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: user
    }));

    return event;
    
  } else {
    return event;
  }
}