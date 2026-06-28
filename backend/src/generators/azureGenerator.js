// Azure Log Generator Module
import { azureTemplates } from '../templates/azureTemplates.js';
import {
  randomChoice,
  randomRange,
  randomIP,
  randomUsername,
  randomUUID
} from '../utils/random.js';

// Random subscription and resource group helpers
function getAzureSubscription() {
  return randomUUID();
}

function getAzureRG() {
  return randomChoice(['rg-prod-core', 'rg-dev-app', 'rg-data-analytics', 'rg-networking', 'rg-security-logs']);
}

function getAzureVM() {
  return randomChoice(['vm-web-01', 'vm-web-02', 'vm-sql-db', 'vm-k8s-master', 'vm-jumpbox']);
}

export function generateAzureLog(type, severity, timestamp) {
  const sub = getAzureSubscription();
  const rg = getAzureRG();
  const vm = getAzureVM();
  const username = randomUsername();
  const uuid = randomUUID();

  // If type is azure-signin
  if (type === 'azure-signin') {
    const available = azureTemplates.signIn[severity] || azureTemplates.signIn.info;
    const template = randomChoice(available);

    const userPrincipalName = template.userPrincipalName.replace(/{username}/g, username);
    const ip = randomIP();

    // Default locations
    let country = 'US';
    let city = randomChoice(['Seattle', 'New York', 'Austin', 'San Francisco', 'Chicago']);
    if (template.location && template.location.countryOrRegion === 'Unknown') {
      country = 'CN';
      city = 'Beijing'; // Suspicious location for alerts
    }

    const record = {
      time: timestamp.toISOString(),
      resourceId: `/subscriptions/${sub}/providers/Microsoft.aadi/directory`,
      operationName: template.operationName,
      category: 'SignInLogs',
      resultType: String(template.status.errorCode),
      resultSignature: template.status.errorCode === 0 ? 'None' : 'SigninFailure',
      resultDescription: template.status.failureReason,
      durationMs: randomRange(50, 450),
      callerIpAddress: ip,
      correlationId: randomUUID(),
      identity: userPrincipalName,
      properties: {
        userPrincipalName: userPrincipalName,
        appDisplayName: template.appDisplayName,
        clientAppUsed: template.clientAppUsed,
        conditionalAccessStatus: template.conditionalAccessStatus,
        location: {
          countryOrRegion: country,
          city: city
        },
        mfaDetail: template.mfaDetail ? {
          mfaAuthMethod: template.mfaDetail.mfaAuthMethod,
          mfaAuthStep: template.mfaDetail.mfaAuthStep
        } : null
      }
    };

    if (template.properties && template.properties.alert) {
      record.properties.alert = template.properties.alert;
    }

    return JSON.stringify(record);
  }

  // If type is azure-activity
  const available = azureTemplates.activity[severity] || azureTemplates.activity.info;
  const template = randomChoice(available);

  const resourceId = template.resourceId
    .replace(/{sub}/g, sub)
    .replace(/{rg}/g, rg)
    .replace(/{vm}/g, vm)
    .replace(/{uuid}/g, uuid);

  const caller = `${username}@contoso.onmicrosoft.com`;

  // Custom properties replacements
  let properties = null;
  if (template.properties) {
    let propStr = JSON.stringify(template.properties);
    propStr = propStr
      .replace(/{username}/g, username)
      .replace(/{sub}/g, sub)
      .replace(/{rg}/g, rg)
      .replace(/{uuid}/g, uuid);
    properties = JSON.parse(propStr);
  }

  const record = {
    time: timestamp.toISOString(),
    resourceId: resourceId,
    operationName: template.operationName,
    category: 'Administrative',
    resultType: template.status,
    correlationId: randomUUID(),
    caller: caller,
    level: template.level,
    properties: properties
  };

  return JSON.stringify(record);
}
