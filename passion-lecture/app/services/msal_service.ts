// app/services/msal_service.ts
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node'
import env from '#start/env'

const msalConfig: Configuration = {
  auth: {
    clientId: env.get('MSAL_CLIENT_ID')!,
    authority: `https://login.microsoftonline.com/${env.get('MSAL_TENANT_ID')}`,
    clientSecret: env.get('MSAL_CLIENT_SECRET'),
  },
}

export const msalClient = new ConfidentialClientApplication(msalConfig)
