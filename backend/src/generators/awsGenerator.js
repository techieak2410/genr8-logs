// AWS Log Generator Module
import { awsTemplates } from '../templates/awsTemplates.js';
import {
  randomChoice,
  randomRange,
  randomIP,
  randomAWSAccount,
  randomEC2InstanceID,
  randomSessionID,
  randomUUID,
  randomRequestID,
  randomRegion,
  randomPort,
  randomUsername,
  randomUserAgent
} from '../utils/random.js';

export function generateAWSLog(type, severity, timestamp) {
  // If type is VPC Flow Logs, format is space-delimited text
  if (type === 'aws-vpcflow') {
    const available = awsTemplates.vpcFlow[severity] || awsTemplates.vpcFlow.info;
    const template = randomChoice(available);

    const version = '2';
    const account = randomAWSAccount();
    const interfaceId = 'eni-' + randomRange(10000000, 99999999).toString(16) + 'f' + randomRange(0, 9);
    
    // Weighted addresses
    const srcAddr = randomIP();
    const dstAddr = randomIP();
    
    // Ports
    let srcPort, dstPort;
    if (template.action === 'REJECT' && Math.random() < 0.5) {
      // simulate RDP or SSH block
      dstPort = randomChoice([22, 3389, 445, 139]);
      srcPort = randomPort(false);
    } else {
      srcPort = randomPort(false);
      dstPort = randomPort(Math.random() < 0.5);
    }

    const protocol = template.protocol;
    const packets = randomRange(1, 150);
    const bytes = packets * randomRange(40, 1500);
    
    const startEpoch = Math.floor(timestamp.getTime() / 1000);
    const endEpoch = startEpoch + randomRange(10, 60);
    
    const action = template.action;
    const status = 'OK';

    // Format: 2 123456789012 eni-1a2b3c4d 192.168.1.10 10.0.0.5 49152 443 6 20 1200 1625000000 1625000060 ACCEPT OK
    return `${version} ${account} ${interfaceId} ${srcAddr} ${dstAddr} ${srcPort} ${dstPort} ${protocol} ${packets} ${bytes} ${startEpoch} ${endEpoch} ${action} ${status}`;
  }

  // If type is EC2 status events (system text log)
  if (type === 'aws-ec2' && Math.random() < 0.3) {
    const available = awsTemplates.ec2Events[severity] || awsTemplates.ec2Events.info;
    const template = randomChoice(available);
    const username = randomUsername();
    const instance = randomEC2InstanceID();
    const uuid = randomRange(100000, 999999).toString(16);
    const ip = randomIP();

    let message = template
      .replace(/{username}/g, username)
      .replace(/{instance}/g, instance)
      .replace(/{uuid}/g, uuid)
      .replace(/{ip}/g, ip);

    const timestampIso = timestamp.toISOString();
    return `[${timestampIso}] [AWS-EC2] [${severity.toUpperCase()}] ${message}`;
  }

  // Default is CloudTrail JSON log format
  const available = awsTemplates.cloudTrail[severity] || awsTemplates.cloudTrail.info;
  const template = randomChoice(available);

  const account = randomAWSAccount();
  const username = randomUsername();
  const session = randomSessionID();
  const uuid = randomUUID();
  const accessKey = randomRange(10000000, 99999999).toString(36).toUpperCase();
  const region = randomRegion();
  const ip = randomIP();
  const userAgent = randomUserAgent();

  // Custom replacements inside JSON requestParameters
  let requestParamsStr = template.requestParameters ? JSON.stringify(template.requestParameters) : '{}';
  requestParamsStr = requestParamsStr
    .replace(/{username}/g, username)
    .replace(/{account}/g, account)
    .replace(/{session}/g, session)
    .replace(/{uuid}/g, uuid)
    .replace(/{region}/g, region);

  const requestParameters = JSON.parse(requestParamsStr);

  const record = {
    eventVersion: '1.08',
    userIdentity: {
      type: template.userIdentity.type,
      principalId: `${template.userIdentity.type === 'AssumedRole' ? 'AROA' : 'AIDA'}${randomRange(100000, 999999).toString(36).toUpperCase()}:${template.userIdentity.userName.replace(/{username}/g, username)}`,
      arn: `arn:aws:iam::${account}:${template.userIdentity.type === 'AssumedRole' ? 'role' : 'user'}/${template.userIdentity.userName.replace(/{username}/g, username)}`,
      accountId: account,
      accessKeyId: `AKIA${randomRange(10000000, 99999999).toString(36).toUpperCase()}`,
      userName: template.userIdentity.userName.replace(/{username}/g, username)
    },
    eventTime: timestamp.toISOString(),
    eventSource: template.eventSource,
    eventName: template.eventName,
    awsRegion: region,
    sourceIPAddress: ip,
    userAgent: userAgent,
    requestParameters: requestParameters,
    responseElements: template.responseElements,
    requestID: randomRequestID(),
    eventID: randomUUID(),
    readOnly: template.eventName.startsWith('Describe') || template.eventName.startsWith('Get') || template.eventName.startsWith('List'),
    resources: [
      {
        accountId: account,
        type: 'AWS::AllResources',
        ARN: `arn:aws:${template.eventSource.split('.')[0]}:${region}:${account}:*`
      }
    ],
    eventType: 'AwsApiCall',
    recipientAccountId: account
  };

  if (template.errorCode) {
    record.errorCode = template.errorCode;
    record.errorMessage = template.errorMessage.replace(/{arn}/g, record.userIdentity.arn);
  }

  if (template.additionalEventData) {
    record.additionalEventData = template.additionalEventData;
  }

  // Return formatted JSON string
  return JSON.stringify(record);
}
