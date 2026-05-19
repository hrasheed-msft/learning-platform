targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment (used for resource naming)')
param environmentName string

@description('Primary location for all resources')
param location string = 'eastus'

@secure()
@description('PostgreSQL administrator password')
param postgresAdminPassword string

@description('PostgreSQL administrator username')
param postgresAdminUser string = 'pgadmin'

var abbrs = {
  resourceGroup: 'rg-'
  logAnalytics: 'log-'
  appInsights: 'appi-'
  containerRegistry: 'cr'
  containerAppsEnv: 'cae-'
  containerApp: 'ca-'
  postgres: 'psql-'
  redis: 'redis-'
  keyVault: 'kv-'
  staticWebApp: 'swa-'
}

var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = {
  'azd-env-name': environmentName
  project: 'islamic-learning-platform'
}

// Resource Group
resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: '${abbrs.resourceGroup}${environmentName}-${location}'
  location: location
  tags: tags
}

// Deploy all resources into the resource group
module resources 'resources.bicep' = {
  name: 'resources'
  scope: rg
  params: {
    location: location
    environmentName: environmentName
    resourceToken: resourceToken
    tags: tags
    postgresAdminUser: postgresAdminUser
    postgresAdminPassword: postgresAdminPassword
  }
}

output AZURE_RESOURCE_GROUP string = rg.name
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = resources.outputs.containerRegistryEndpoint
output AZURE_CONTAINER_REGISTRY_NAME string = resources.outputs.containerRegistryName
output API_URL string = resources.outputs.apiUrl
output WEB_URL string = resources.outputs.webUrl
output POSTGRES_FQDN string = resources.outputs.postgresFqdn
