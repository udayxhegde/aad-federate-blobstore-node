# What is Azure AD Workload identity federation

When applications, scripts, or services run in Azure, they can use Azure managed identities to avoid dealing with secrets for Azure AD identities. With Azure managed identities, the secrets are stored and managed by the Azure platform.
However, when applications or services run in environments outside Azure, they need Azure AD application secrets to authenticate to Azure AD and access resources such as Azure and Microsoft Graph. These secrets pose a security risk if they are not stored securely and rotated regularly. Azure AD workload identity federation removes the need for these secrets in selected scenarios. Developers can configure their Azure AD applications to trust tokens issued by another identity provider. These trusted tokens can then be used to access resources available to those applications.

This repo has examples for several scenarios where a service deployed in a certain environment can access Azure resources without needing secrets. (beyond GitHub CI/CD)

This repo supports the following scenarios, and the FEDERATED_ENVIRONMENT enviroment variable defines which scenarios is executed:
- Google
- k8sMSAL
- k8sAzureIdentity
- spiffe

The auth folder has the code specific to each scenario.

When I deploy this in a kubernetes environement, and want to use the Azure Identity SDK, I use the deployment/k8s/deployment.yaml to deploy the demo service

If I want to try out the MSAL SDK, I use the deployment/k8s/deployment-msal.yaml

