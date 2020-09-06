# Next CDK Appsync Example

This is an example app where I've used `appsync` (**not the cli**) and `react query` (mainly for catching).

Everything is deployed on `Fargate`.

## Deploying

First, you will need to deploy the backend, **make sure you have your `aws-cli` and `aws-cdk` setup**

```bash
cd backend && npm run deploy:backend
```

Then you can test it locally

```bash
cd frontend && npm run dev
```

If you wish to deploy frontend as well **make sure you deploy the backend first**.

```bash
cd backend && npm run deploy:frontend
```
