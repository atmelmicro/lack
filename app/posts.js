import { json } from "../client-utils";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { z } from "zod";
import { v4 } from "uuid";

const CLIENT = new DynamoDBClient({});
const DOCUMENT_CLIENT = DynamoDBDocumentClient.from(CLIENT);

export async function $index() {
  const response = await DOCUMENT_CLIENT.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  return json(response.Items);
}

export async function show__id() {
  return { body: { a: "b" }, statusCode: 200 };
}

export async function show_id() {
  return { body: { a: "b" }, statusCode: 200 };
}

export async function put$update(event) {
  const data = z
    .object({
      title: z.string(),
    })
    .parse(JSON.parse(event.body));

  const response = await DOCUMENT_CLIENT.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: { id: v4(), title: data.title },
    })
  );

  return json(response);
}

export async function test__plink__$id__a__$id2(event) {
  return json({
    params: event.pathParameters,
    search: event.queryStringParameters,
  });
}
