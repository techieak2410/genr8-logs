// GCP Log Generator Module
import { gcpTemplates } from '../templates/gcpTemplates.js';
import {
  randomChoice,
  randomRange,
  randomIP,
  randomUsername,
  randomUUID,
  randomRegion,
  randomAZ,
  randomUserAgent,
  randomGCPProject
} from '../utils/random.js';

export function generateGCPLog(type, severity, timestamp) {
  const project = randomGCPProject();
  const region = randomRegion();
  const zone = randomAZ(region);
  const username = randomUsername();
  const uuid = randomUUID();
  const ip = randomIP();
  const userAgent = randomUserAgent();

  // If type is gce system events
  if (type === 'gcp-gce') {
    const available = gcpTemplates.gceEvents[severity] || gcpTemplates.gceEvents.info;
    const template = randomChoice(available);

    let message = template
      .replace(/{username}/g, username)
      .replace(/{uuid}/g, uuid.slice(0, 8))
      .replace(/{ip}/g, ip);

    // Format like Google Cloud Logging syslog output
    // <timestamp> gce-instance-1234 google-accounts-daemon[123]: message
    const instanceId = randomRange(1000000000000000, 9999999999999999).toString();
    const isoDate = timestamp.toISOString();
    return `${isoDate} gce-inst-${uuid.slice(0, 6)} compute.googleapis.com/guest-agent[${randomRange(500, 2000)}]: ${message}`;
  }

  // Default is GCP Audit Log JSON format
  const available = gcpTemplates.audit[severity] || gcpTemplates.audit.info;
  const template = randomChoice(available);

  const resourceName = template.resourceName
    .replace(/{project}/g, project)
    .replace(/{zone}/g, zone)
    .replace(/{region}/g, region)
    .replace(/{uuid}/g, uuid.slice(0, 8));

  const principalEmail = template.principalEmail
    .replace(/{username}/g, username)
    .replace(/{project}/g, project);

  const gcpSeverity = template.severity; // INFO, WARNING, ERROR, CRITICAL

  // Determine resource type based on serviceName
  let resourceType = 'gce_instance';
  if (template.serviceName === 'storage.googleapis.com') {
    resourceType = 'gcs_bucket';
  } else if (template.serviceName === 'iam.googleapis.com') {
    resourceType = 'iam_role';
  } else if (template.serviceName === 'dns.googleapis.com') {
    resourceType = 'dns_managed_zone';
  }

  const logType = gcpSeverity === 'CRITICAL' || gcpSeverity === 'ERROR' ? 'cloudaudit.googleapis.com%2Factivity' : 'cloudaudit.googleapis.com%2Fdata_access';

  const record = {
    insertId: randomUUID().replace(/-/g, '').slice(0, 24),
    logName: `projects/${project}/logs/${logType}`,
    resource: {
      type: resourceType,
      labels: {
        project_id: project,
        ...(resourceType === 'gce_instance' && { instance_id: randomRange(100000000000, 999999999999).toString(), zone: zone }),
        ...(resourceType === 'gcs_bucket' && { bucket_name: resourceName.split('/').pop() })
      }
    },
    protoPayload: {
      '@type': 'type.googleapis.com/google.cloud.audit.AuditLog',
      serviceName: template.serviceName,
      methodName: template.methodName,
      resourceName: resourceName,
      authenticationInfo: {
        principalEmail: principalEmail
      },
      requestMetadata: {
        callerIp: ip,
        callerSuppliedUserAgent: userAgent
      }
    },
    timestamp: timestamp.toISOString(),
    severity: gcpSeverity
  };

  // Add status if any
  if (template.status) {
    record.protoPayload.status = {
      code: template.status.code,
      message: template.status.message
    };
  }

  // Add bindingDelta for IAM SetIamPolicy
  if (template.bindingDelta) {
    record.protoPayload.serviceData = {
      policyDelta: {
        bindingDeltas: [
          {
            action: template.bindingDelta.action,
            role: template.bindingDelta.role,
            member: template.bindingDelta.member
          }
        ]
      }
    };
  }

  return JSON.stringify(record);
}
