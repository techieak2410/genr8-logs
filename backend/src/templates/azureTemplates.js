// Azure Event Templates

export const azureTemplates = {
  // Azure AD Sign-in Logs
  signIn: {
    info: [
      {
        operationName: 'Sign-in activity',
        userPrincipalName: '{username}@contoso.onmicrosoft.com',
        appDisplayName: 'Azure Portal',
        clientAppUsed: 'Browser',
        status: {
          errorCode: 0,
          failureReason: 'None'
        },
        conditionalAccessStatus: 'success',
        mfaDetail: {
          mfaAuthMethod: 'Microsoft Authenticator',
          mfaAuthStep: 'Single-Factor Authentication completed; Multi-Factor Authentication required by policy completed.'
        }
      },
      {
        operationName: 'Sign-in activity',
        userPrincipalName: '{username}@contoso.onmicrosoft.com',
        appDisplayName: 'Office 365 Exchange Online',
        clientAppUsed: 'Mobile App',
        status: {
          errorCode: 0,
          failureReason: 'None'
        },
        conditionalAccessStatus: 'success',
        mfaDetail: null
      }
    ],
    warning: [
      {
        operationName: 'Sign-in activity',
        userPrincipalName: '{username}@contoso.onmicrosoft.com',
        appDisplayName: 'Azure Portal',
        clientAppUsed: 'PowerShell',
        status: {
          errorCode: 50126,
          failureReason: 'Invalid username or password or Invalid external realm.'
        },
        conditionalAccessStatus: 'notApplied',
        mfaDetail: null
      },
      {
        operationName: 'Sign-in activity',
        userPrincipalName: '{username}@contoso.onmicrosoft.com',
        appDisplayName: 'Azure CLI',
        clientAppUsed: 'Command Line',
        status: {
          errorCode: 50074,
          failureReason: 'Strong Authentication (MFA) is required.'
        },
        conditionalAccessStatus: 'notSatisfied',
        mfaDetail: {
          mfaAuthMethod: 'SMS',
          mfaAuthStep: 'MFA challenge sent, user did not respond.'
        }
      }
    ],
    error: [
      {
        operationName: 'Sign-in activity',
        userPrincipalName: '{username}@contoso.onmicrosoft.com',
        appDisplayName: 'Azure Portal',
        clientAppUsed: 'Browser',
        status: {
          errorCode: 53003,
          failureReason: 'Access has been blocked by Conditional Access policies. The sign-in location is not authorized.'
        },
        conditionalAccessStatus: 'failure',
        location: {
          countryOrRegion: 'Unknown',
          city: 'Unknown'
        }
      }
    ],
    critical: [
      {
        operationName: 'Sign-in activity',
        userPrincipalName: 'admin-breakglass@contoso.onmicrosoft.com',
        appDisplayName: 'Azure Portal',
        clientAppUsed: 'Browser',
        status: {
          errorCode: 0,
          failureReason: 'None'
        },
        conditionalAccessStatus: 'notApplied',
        mfaDetail: null,
        properties: {
          alert: 'Emergency access (Break-Glass) account logged in. Incident response active.'
        }
      }
    ]
  },

  // Azure Activity Logs (ARM operations)
  activity: {
    info: [
      {
        operationName: 'Microsoft.Compute/virtualMachines/start/action',
        resourceId: '/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{vm}',
        status: 'Succeeded',
        level: 'Information'
      },
      {
        operationName: 'Microsoft.Resources/deployments/write',
        resourceId: '/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Resources/deployments/deploy-{uuid}',
        status: 'Succeeded',
        level: 'Information'
      },
      {
        operationName: 'Microsoft.Storage/storageAccounts/listKeys/action',
        resourceId: '/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/store{uuid}',
        status: 'Succeeded',
        level: 'Information'
      }
    ],
    warning: [
      {
        operationName: 'Microsoft.Network/networkSecurityGroups/write',
        resourceId: '/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/networkSecurityGroups/nsg-rules',
        status: 'Started',
        level: 'Warning',
        properties: {
          message: 'Security rule RDP-Allow-All is open to the public internet.'
        }
      }
    ],
    error: [
      {
        operationName: 'Microsoft.Compute/virtualMachines/write',
        resourceId: '/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/virtualMachines/{vm}',
        status: 'Failed',
        level: 'Error',
        properties: {
          statusCode: 'Conflict',
          statusMessage: 'QuotaExceeded: The subscription has reached its CPU limit.'
        }
      },
      {
        operationName: 'Microsoft.Web/serverfarms/write',
        resourceId: '/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Web/serverfarms/asp-prod',
        status: 'Failed',
        level: 'Error',
        properties: {
          statusCode: 'NotFound',
          statusMessage: 'Resource Group {rg} could not be found.'
        }
      }
    ],
    critical: [
      {
        operationName: 'Microsoft.Authorization/roleAssignments/write',
        resourceId: '/subscriptions/{sub}/providers/Microsoft.Authorization/roleAssignments/{uuid}',
        status: 'Succeeded',
        level: 'Critical',
        properties: {
          roleDefinitionId: '/providers/Microsoft.Authorization/roleDefinitions/8e3af227-0b1d-4c58-b988-5c4632f81490', // Owner Role
          principalId: '{uuid}',
          scope: '/subscriptions/{sub}',
          message: 'Global Owner assigned to user {username}'
        }
      },
      {
        operationName: 'Microsoft.Network/expressRouteCircuits/delete',
        resourceId: '/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/expressRouteCircuits/express-route-corp',
        status: 'Succeeded',
        level: 'Critical',
        properties: {
          message: 'Primary corporate network circuit deleted by user {username}'
        }
      }
    ]
  }
};
