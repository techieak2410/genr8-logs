// AWS Event Templates

export const awsTemplates = {
  // CloudTrail is JSON based. We will generate objects and JSON.stringify them in the generator.
  cloudTrail: {
    info: [
      {
        eventName: 'DescribeInstances',
        eventSource: 'ec2.amazonaws.com',
        userIdentity: {
          type: 'AssumedRole',
          userName: 'Role-EC2-Admin'
        },
        requestParameters: {
          instancesSet: {},
          filterSet: {}
        },
        responseElements: null
      },
      {
        eventName: 'ConsoleLogin',
        eventSource: 'signin.amazonaws.com',
        userIdentity: {
          type: 'IAMUser',
          userName: '{username}'
        },
        requestParameters: null,
        responseElements: {
          ConsoleLogin: 'Success'
        }
      },
      {
        eventName: 'GetBucketPolicy',
        eventSource: 's3.amazonaws.com',
        userIdentity: {
          type: 'IAMUser',
          userName: '{username}'
        },
        requestParameters: {
          bucketName: 'prod-data-lake-{uuid}'
        },
        responseElements: null
      },
      {
        eventName: 'AssumeRole',
        eventSource: 'sts.amazonaws.com',
        userIdentity: {
          type: 'IAMUser',
          userName: '{username}'
        },
        requestParameters: {
          roleArn: 'arn:aws:iam::{account}:role/ReadOnlyAdmin',
          roleSessionName: '{session}'
        },
        responseElements: {
          credentials: {
            accessKeyId: 'ASIA{accessKey}'
          }
        }
      },
      {
        eventName: 'CreateKeyPair',
        eventSource: 'ec2.amazonaws.com',
        userIdentity: {
          type: 'AssumedRole',
          userName: 'Developer-Admin'
        },
        requestParameters: {
          keyName: 'temp-deploy-key-{username}'
        },
        responseElements: {
          keyFingerprint: 'ab:cd:ef:12:34:56:78:90:ab:cd:ef:12:34:56:78:90'
        }
      }
    ],
    warning: [
      {
        eventName: 'ConsoleLogin',
        eventSource: 'signin.amazonaws.com',
        userIdentity: {
          type: 'IAMUser',
          userName: '{username}'
        },
        requestParameters: null,
        responseElements: {
          ConsoleLogin: 'Failure'
        },
        additionalEventData: {
          MFAUsed: 'No',
          LoginMethod: 'Password'
        }
      },
      {
        eventName: 'Decrypt',
        eventSource: 'kms.amazonaws.com',
        userIdentity: {
          type: 'AssumedRole',
          userName: 'app-service-role'
        },
        requestParameters: {
          keyId: 'arn:aws:kms:{region}:{account}:key/{uuid}'
        },
        errorCode: 'AccessDenied',
        errorMessage: 'The ciphertext refers to a customer master key that does not exist or you do not have Access.'
      }
    ],
    error: [
      {
        eventName: 'PutBucketPolicy',
        eventSource: 's3.amazonaws.com',
        userIdentity: {
          type: 'IAMUser',
          userName: '{username}'
        },
        requestParameters: {
          bucketName: 'billing-reports-secure',
          policy: '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:*\"}]}'
        },
        errorCode: 'AccessDenied',
        errorMessage: 'User {arn} is not authorized to perform s3:PutBucketPolicy on resource billing-reports-secure'
      },
      {
        eventName: 'DeleteSecurityGroup',
        eventSource: 'ec2.amazonaws.com',
        userIdentity: {
          type: 'IAMUser',
          userName: '{username}'
        },
        requestParameters: {
          groupId: 'sg-{uuid}'
        },
        errorCode: 'DependencyViolation',
        errorMessage: 'Resource sg-{uuid} is in use and cannot be deleted.'
      }
    ],
    critical: [
      {
        eventName: 'UpdateAssumeRolePolicy',
        eventSource: 'iam.amazonaws.com',
        userIdentity: {
          type: 'Root',
          userName: 'root'
        },
        requestParameters: {
          roleName: 'AdministratorAccess',
          policyDocument: '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":\"arn:aws:iam::{attackerAccount}:root\"},\"Action\":\"sts:AssumeRole\"}]}'
        },
        responseElements: null
      },
      {
        eventName: 'DeactivateMFADevice',
        eventSource: 'iam.amazonaws.com',
        userIdentity: {
          type: 'Root',
          userName: 'root'
        },
        requestParameters: {
          userName: 'SecurityAdmin',
          serialNumber: 'arn:aws:iam::{account}:mfa/SecurityAdminDevice'
        },
        responseElements: null
      }
    ]
  },

  // VPC Flow Logs are space-separated fields.
  // Version AccountID InterfaceID SrcAddr DstAddr SrcPort DstPort Protocol Packets Bytes Start End Action LogStatus
  vpcFlow: {
    info: [
      {
        protocol: 6, // TCP
        action: 'ACCEPT'
      },
      {
        protocol: 17, // UDP
        action: 'ACCEPT'
      }
    ],
    warning: [
      {
        protocol: 6,
        action: 'REJECT' // Denied firewall
      }
    ],
    error: [
      {
        protocol: 1, // ICMP
        action: 'REJECT'
      }
    ],
    critical: [
      {
        protocol: 6,
        action: 'REJECT' // Heavy port scan simulation
      }
    ]
  },

  // EC2 and IAM state events (e.g. Instance Launching, Instance Terminating, etc.)
  ec2Events: {
    info: [
      'EC2 Instance state change: {instance} changed state to running (initiated by user {username})',
      'EC2 Instance state change: {instance} changed state to stopping (initiated by user {username})',
      'EC2 Volume attached: vol-{uuid} successfully attached to instance {instance} as /dev/xvda'
    ],
    warning: [
      'EC2 Instance status check: {instance} instance status check failed. Retrying auto-recovery.',
      'EC2 Instance {instance} average CPU utilization exceeded threshold (85.4% over 5 minutes)'
    ],
    error: [
      'EC2 Auto Scaling: Instance {instance} launched but failed health checks. Terminating instance.',
      'EC2 Snapshot creation failed: snap-{uuid} failed due to volume disconnect'
    ],
    critical: [
      'EC2 Instance {instance} shut down unexpectedly. Host physical hardware failure detected.',
      'EC2 Security Group sg-{uuid} modified to allow inbound traffic from 0.0.0.0/0 on port 22'
    ]
  }
};
