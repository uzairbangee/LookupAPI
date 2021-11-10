#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiStackerStack } from '../lib/api-stacker-stack';

const deployEnv = process.env.DEPLOY_ENV || "uzair";

const app = new cdk.App();
new ApiStackerStack(app, deployEnv + "-APISTACKERPANACLOUD", {
  env: {
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION 
  },
  prod: deployEnv
});
