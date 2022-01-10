# What is Azure AD Workload identity federation

When applications, scripts, or services run in Azure, they can use Azure managed identities to avoid dealing with secrets for Azure AD identities. With Azure managed identities, the secrets are stored and managed by the Azure platform.
However, when applications or services run in environments outside Azure, they need Azure AD application secrets to authenticate to Azure AD and access resources such as Azure and Microsoft Graph. These secrets pose a security risk if they are not stored securely and rotated regularly. Azure AD workload identity federation removes the need for these secrets in selected scenarios. Developers can configure their Azure AD applications to trust tokens issued by another identity provider. These trusted tokens can then be used to access resources available to those applications.

This repo has examples for several scenarios where a service deployed in a certain environment can access Azure resources without needing secrets. (beyond GitHub CI/CD)

- Service running in a kubernetes cluster, using SPIFFE/SPIRE
In this 

- Service running in a kubernets cluster, using kubernetes tokens issued to service accounts via service account volume projection and OIDC support. This has two variations: 
1. using Azure Identity SDK
2. using MSAL SDK

- Service running in Google Cloud Platform (GCP) and using a GCP service account


