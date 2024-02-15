import {
  App,
  CfnOutput,
  Duration,
  Fn,
  Stack,
  aws_apigatewayv2,
  aws_apigatewayv2_integrations,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_lambda,
  aws_logs,
} from "aws-cdk-lib";
import { getAllRoutes } from "./utils";
import { join } from "path";

const methods = {
  get: aws_apigatewayv2.HttpMethod.GET,
  post: aws_apigatewayv2.HttpMethod.POST,
  delete: aws_apigatewayv2.HttpMethod.DELETE,
  put: aws_apigatewayv2.HttpMethod.PUT,
};

async function deploy() {
  const app = new App();
  const stack = new Stack(app, "llrt-example", {
    env: {
      region: "eu-central-1",
    },
  });

  const userCdk = await import("./lac.config");
  const method = userCdk["cdk"];
  let userObject:
    | undefined
    | {
        env: Record<string, string>;
        post: (lambdas: aws_lambda.Function[]) => Promise<void>;
      };
  method && (userObject = method(stack));

  const httpApi = new aws_apigatewayv2.HttpApi(stack, `HttpApi`, {
    disableExecuteApiEndpoint: false,
    corsPreflight: undefined,
  });

  const routePaths: string[] = [];
  const addRoute = (
    name: string,
    path: string,
    func: string,
    routePath: string,
    method: string
  ) => {
    const lambda = new aws_lambda.Function(stack, name, {
      functionName: name,
      code: aws_lambda.Code.fromAsset(path),
      ...props,
      handler: `index.${func}`,
      environment: props.environment,
      runtime: aws_lambda.Runtime.PROVIDED_AL2,
      layers: [llrtLayer],
    });

    const integration = new aws_apigatewayv2_integrations.HttpLambdaIntegration(
      `${lambda.node.id}Integration`,
      lambda
    );

    new aws_apigatewayv2.HttpRoute(stack, `${lambda.node.id}Route`, {
      httpApi,
      routeKey: aws_apigatewayv2.HttpRouteKey.with(routePath, methods[method]),
      integration,
    });

    routePaths.push(routePath);
    return lambda;
  };

  const httpEndpointNoProto = Fn.select(
    1,
    Fn.split("://", httpApi.apiEndpoint)
  );

  const llrtLayer = new aws_lambda.LayerVersion(stack, "LlrtArmLayer", {
    code: aws_lambda.Code.fromAsset("./llrt-lambda-arm64.zip"),
    compatibleRuntimes: [
      aws_lambda.Runtime.NODEJS_16_X,
      aws_lambda.Runtime.NODEJS_20_X,
      aws_lambda.Runtime.NODEJS_20_X,
      aws_lambda.Runtime.NODEJS_LATEST,
      aws_lambda.Runtime.PROVIDED_AL2,
    ],
    compatibleArchitectures: [aws_lambda.Architecture.ARM_64],
  });

  const props: Partial<aws_lambda.FunctionProps> = {
    runtime: aws_lambda.Runtime.NODEJS_20_X,
    memorySize: 128,
    timeout: Duration.seconds(60),
    architecture: aws_lambda.Architecture.ARM_64,
    logRetention: aws_logs.RetentionDays.ONE_DAY,
    environment: userObject?.env,
  };

  const routes = await getAllRoutes();
  const lambdas: aws_lambda.Function[] = [];
  for (const route of routes) {
    const lambda = addRoute(
      route.lambdaMatcher.replaceAll("/", "__").replaceAll(/{|}/gi, "-"),
      join("./out/lambda", route.path),
      route.func,
      route.lambdaMatcher,
      route.method
    );
    lambdas.push(lambda);
  }

  for (const [i, route] of routePaths.entries()) {
    new CfnOutput(stack, `HttpApiOutput${i}`, {
      value: `${httpApi.apiEndpoint}${route}`,
    });
  }

  const id = "Lac";
  const distribution = new aws_cloudfront.Distribution(
    stack,
    `${id}Distribution`,
    {
      defaultBehavior: {
        origin: new aws_cloudfront_origins.HttpOrigin(httpEndpointNoProto, {
          protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }),
        originRequestPolicy:
          aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
      },
    }
  );

  new CfnOutput(stack, `DistributionOutput${id}`, {
    value: distribution.distributionDomainName,
  });

  if (userObject?.post) await userObject.post(lambdas);
}

deploy();
