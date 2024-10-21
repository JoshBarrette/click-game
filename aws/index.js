import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocument.from(new DynamoDB());

export const handler = async (event, context) => {
  const body = await JSON.parse(event.body);
  if (!body.score) {
    return;
  }

  var params = {
    TableName: "click-game",
    Item: {
      "part-key": event.requestContext.requestId,
      score: body.score,
    },
  };

  return await dynamo.put(params);
};
