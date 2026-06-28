// GCP Event Templates

export const gcpTemplates = {
  // GCP Cloud Audit Logs (cloudaudit.googleapis.com)
  audit: {
    info: [
      {
        serviceName: 'compute.googleapis.com',
        methodName: 'v1.compute.instances.insert',
        principalEmail: '{username}@{project}.iam.gserviceaccount.com',
        resourceName: 'projects/{project}/zones/{zone}/instances/gce-{uuid}',
        severity: 'INFO'
      },
      {
        serviceName: 'storage.googleapis.com',
        methodName: 'storage.buckets.create',
        principalEmail: '{username}@gmail.com',
        resourceName: 'projects/_/buckets/gcs-bucket-prod-{uuid}',
        severity: 'INFO'
      },
      {
        serviceName: 'iam.googleapis.com',
        methodName: 'google.iam.admin.v1.CreateRole',
        principalEmail: '{username}@gmail.com',
        resourceName: 'projects/{project}/roles/CustomDevOpsRole',
        severity: 'INFO'
      },
      {
        serviceName: 'dns.googleapis.com',
        methodName: 'dns.changes.create',
        principalEmail: '{username}@{project}.iam.gserviceaccount.com',
        resourceName: 'projects/{project}/managedZones/corp-zone',
        severity: 'INFO'
      }
    ],
    warning: [
      {
        serviceName: 'compute.googleapis.com',
        methodName: 'v1.compute.instances.setMetadata',
        principalEmail: '{username}@gmail.com',
        resourceName: 'projects/{project}/zones/{zone}/instances/gce-{uuid}',
        severity: 'WARNING',
        status: {
          code: 9,
          message: 'Precondition check failed: service account lacks compute.instances.setMetadata permission.'
        }
      },
      {
        serviceName: 'bigquery.googleapis.com',
        methodName: 'google.cloud.bigquery.v2.JobService.InsertJob',
        principalEmail: '{username}@gmail.com',
        resourceName: 'projects/{project}/jobs/job_bq_export_{uuid}',
        severity: 'WARNING',
        status: {
          code: 3,
          message: 'Query completed with warnings. Large scan without partition filter.'
        }
      }
    ],
    error: [
      {
        serviceName: 'storage.googleapis.com',
        methodName: 'storage.objects.get',
        principalEmail: '{username}@gmail.com',
        resourceName: 'projects/_/buckets/confidential-financials/objects/q4_forecast.xlsx',
        severity: 'ERROR',
        status: {
          code: 7,
          message: 'Permission denied. Caller is not authorized to read bucket: confidential-financials'
        }
      },
      {
        serviceName: 'cloudkms.googleapis.com',
        methodName: 'google.cloud.kms.v1.KeyManagementService.DestroyCryptoKeyVersion',
        principalEmail: '{username}@{project}.iam.gserviceaccount.com',
        resourceName: 'projects/{project}/locations/{region}/keyRings/hsm-ring/cryptoKeys/app-key/cryptoKeyVersions/1',
        severity: 'ERROR',
        status: {
          code: 7,
          message: 'Caller lacks permission cloudkms.cryptoKeyVersions.destroy.'
        }
      }
    ],
    critical: [
      {
        serviceName: 'iam.googleapis.com',
        methodName: 'google.iam.admin.v1.SetIamPolicy',
        principalEmail: '{username}@gmail.com',
        resourceName: 'projects/{project}',
        severity: 'CRITICAL',
        status: {
          code: 0,
          message: 'Success'
        },
        bindingDelta: {
          action: 'ADD',
          role: 'roles/owner',
          member: 'user:attacker-extern-account@gmail.com'
        }
      },
      {
        serviceName: 'compute.googleapis.com',
        methodName: 'v1.compute.firewalls.delete',
        principalEmail: '{username}@gmail.com',
        resourceName: 'projects/{project}/global/firewalls/default-deny-ingress',
        severity: 'CRITICAL',
        status: {
          code: 0,
          message: 'Success'
        }
      }
    ]
  },

  // GCP Compute Engine instance system level notifications
  gceEvents: {
    info: [
      'GCE Instance vminfo: guest-agent: Running version 20230501.00',
      'GCE Instance vminfo: google-accounts-daemon: Synced ssh keys for user {username}',
      'GCE Live Migration: Instance gce-{uuid} is undergoing live migration to host physical node {uuid}'
    ],
    warning: [
      'GCE Instance vminfo: guest-agent: Metadata server connection timeout. Retrying...',
      'GCE Disk: IO operations on disk gce-boot-disk reached 90% of provisioned IOPS limit.'
    ],
    error: [
      'GCE Instance: Failed to assign external IP to instance gce-{uuid}. IP quota exceeded.',
      'GCE Shutdown: Auto-scaling engine failed to gracefully drain connections for gce-{uuid} before deletion.'
    ],
    critical: [
      'GCE Live Migration: Live migration failed for gce-{uuid}. Instance terminated unexpectedly.',
      'GCE Security: Blocked potential brute-force access pattern from {ip} on port 22'
    ]
  }
};
