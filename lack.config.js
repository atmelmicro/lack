import { aws_dynamodb } from "aws-cdk-lib";

export function cdk(stack) {
  const table = new aws_dynamodb.Table(stack, "Table", {
    partitionKey: {
      name: "id",
      type: aws_dynamodb.AttributeType.STRING,
    },
    billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  return {
    env: { TABLE_NAME: table.tableName },
    post: async (lambdas) => {
      lambdas.forEach((x) => table.grantReadWriteData(x));
    },
  };
}

export const llrt = "./llrt-lambda-arm64.zip";
export const name = "hello-llrt";
