import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as iam from '@aws-cdk/aws-iam';
import * as appsync from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';

interface EnvProps extends cdk.StackProps {
  /**
   * container image tag
   * @default latest
   */
   prod: string;
}

export class ApiStackerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: EnvProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const apiDependenciesLayer = new lambda.LayerVersion(
      this,
      "lambdaLayer",
      {
        layerVersionName: "Dependencies",
        code: lambda.Code.fromAsset("lambdaLayer"),
      }
    );

    const api = new appsync.GraphqlApi(this, "graphDbNewApi", {
      name: `${props?.prod}-graphDbNewApi`,
      schema: appsync.Schema.fromAsset("graphql/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: false,
      vpcId: "vpc-066783df63bd633c0"
    });

    const securityGroup = ec2.SecurityGroup.fromLookup(this, "SecurityGroup", "sg-030ce95707d3168bb");

    const lambdaAuthorizors: lambda.Function = new lambda.Function(this, "lambdaAuth", {
      functionName: `${props?.prod}-lambdaAuth`,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda/lambdaAuthorizors/appsyncAuth"),
      layers: [apiDependenciesLayer],
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: {
        NEPTUNE_ENDPOINT: "panacloudapicluster.cluster-ro-cketozg0rvr7.us-east-1.neptune.amazonaws.com",
      },
      // vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });

    const getMyApis: lambda.Function = new lambda.Function(this, "getApi", {
      functionName: `${props?.prod}-graphDbLambda`,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda/createApi"),
      layers: [apiDependenciesLayer],
      vpc: vpc,
      securityGroups: [securityGroup],
      environment: {
        NEPTUNE_ENDPOINT: "panacloudapicluster.cluster-ro-cketozg0rvr7.us-east-1.neptune.amazonaws.com",
      },
      // vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    });

    const lambdaDs = api.addLambdaDataSource('getAPIDatasource', getMyApis);

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createApi"
    });

  }
}
