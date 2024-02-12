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
  aws_lambda_nodejs,
  aws_logs,
} from "aws-cdk-lib";
import { getAllRoutes } from "./utils";
import { join } from "path";

async function deploy() {
  const app = new App();
  const stack = new Stack(app, "llrt-example", {
    env: {
      region: "eu-central-1",
    },
  });

  const httpApi = new aws_apigatewayv2.HttpApi(stack, `HttpApi`, {
    disableExecuteApiEndpoint: false,
    corsPreflight: undefined,
  });

  const routePaths: string[] = [];
  const addRoute = (
    name: string,
    path: string,
    func: string,
    routePath: string
  ) => {
    const lambda = new aws_lambda.Function(stack, name, {
      functionName: name,
      code: aws_lambda.Code.fromAsset(path),
      ...props,
      handler: `index.${func}`,
      environment: {},
      runtime: aws_lambda.Runtime.PROVIDED_AL2,
      layers: [llrtLayer],
    });

    const integration = new aws_apigatewayv2_integrations.HttpLambdaIntegration(
      `${lambda.node.id}Integration`,
      lambda
    );

    new aws_apigatewayv2.HttpRoute(stack, `${lambda.node.id}Route`, {
      httpApi,
      routeKey: aws_apigatewayv2.HttpRouteKey.with(
        routePath,
        aws_apigatewayv2.HttpMethod.ANY
      ),
      integration,
    });

    new aws_apigatewayv2.HttpRoute(stack, `${lambda.node.id}ProxyRoute`, {
      httpApi,
      routeKey: aws_apigatewayv2.HttpRouteKey.with(
        `${routePath}/{proxy+}`,
        aws_apigatewayv2.HttpMethod.ANY
      ),
      integration,
    });

    routePaths.push(routePath);
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

  const props = {
    runtime: aws_lambda.Runtime.NODEJS_20_X,
    memorySize: 128,
    timeout: Duration.seconds(60),
    bundling: {
      format: aws_lambda_nodejs.OutputFormat.ESM,
      banner:
        "import {createRequire} from 'module';const require=createRequire(import.meta.url);",
      minify: true,
      sourceMap: true,
    },
    architecture: aws_lambda.Architecture.ARM_64,
    logRetention: aws_logs.RetentionDays.ONE_DAY,
  };

  const routes = await getAllRoutes();
  for (const route of routes) {
    console.log(route);
    addRoute(
      route.lambdaMatcher.replaceAll("/", "__").replaceAll(/{|}/gi, "-"),
      join("./lambda", route.path),
      route.func,
      route.lambdaMatcher
    );
  }

  for (const [i, route] of routePaths.entries()) {
    new CfnOutput(stack, `HttpApiOutput${i}`, {
      value: `${httpApi.apiEndpoint}${route}`,
    });
  }

  const route = "/llrt";
  const id = route.substring(1).replace(/-\//g, "");
  const distribution = new aws_cloudfront.Distribution(
    stack,
    `${id}Distribution`,
    {
      defaultBehavior: {
        origin: new aws_cloudfront_origins.HttpOrigin(httpEndpointNoProto, {
          protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
          originPath: route,
        }),
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
      },
    }
  );

  new CfnOutput(stack, `DistributionOutput${id}`, {
    value: distribution.distributionDomainName,
  });
}

deploy();
