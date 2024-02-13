import { Stack, aws_dynamodb, aws_lambda } from "aws-cdk-lib";

export function cdk(stack: Stack) {
  const table = new aws_dynamodb.Table(stack, "Table", {
    partitionKey: {
      name: "id",
      type: aws_dynamodb.AttributeType.STRING,
    },
    billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  return {
    env: { TABLE_NAME: table.tableName },
    post: async (lambdas: aws_lambda.Function[]) => {
      lambdas.forEach((x) => table.grantReadWriteData(x));
    },
  };
}
