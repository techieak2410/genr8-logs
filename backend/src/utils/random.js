// Randomization Helper Engine for Log Generation

const HOSTNAMES = [
  'web01', 'web02', 'db01', 'db-replica-01', 'auth01',
  'prod-app-01', 'prod-app-02', 'mail01', 'dns01', 'backup01',
  'api-gateway-01', 'cache-redis-01', 'k8s-node-01', 'k8s-node-02',
  'sec-monitor-01', 'bastion-host'
];

const USERNAMES = [
  'admin', 'ubuntu', 'ec2-user', 'root', 'backup', 'alice', 'bob',
  'service-account', 'nginx', 'postfix', 'dbadmin', 'john', 'syslog',
  'ansible', 'jenkins', 'developer'
];

const REGIONS = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1'
];

const AZ_SUFFIXES = ['a', 'b', 'c', 'd'];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'AWS-SDK-Java/1.12.300 Linux/5.10.0-openjdk-11 HotSpot',
  'Boto3/1.26.0 Python/3.10.4 Windows/10 Botocore/1.29.0',
  'gcloud-golang/0.100.0',
  'hashicorp-terraform/1.5.0'
];

const SERVICES = [
  'sshd', 'systemd', 'cron', 'kernel', 'nginx', 'mongod', 'postgresql', 'docker', 'ufw'
];

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];

const URL_PATHS = [
  '/api/v1/login', '/api/v1/users', '/api/v1/checkout', '/index.html',
  '/assets/main.js', '/wp-admin/login.php', '/admin/config', '/api/v2/items',
  '/static/logo.png', '/api/v1/auth/token', '/healthz', '/metrics'
];

// Helper to get random item from array
export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random number in range (inclusive)
export function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random IP address
// 80% private IP, 20% public IP
export function randomIP() {
  if (Math.random() < 0.7) {
    // Private ranges
    const type = Math.random();
    if (type < 0.4) {
      // 192.168.1.X or 192.168.2.X
      return `192.168.${randomRange(1, 2)}.${randomRange(2, 254)}`;
    } else if (type < 0.8) {
      // 10.0.X.Y or 10.1.X.Y
      return `10.${randomRange(0, 5)}.${randomRange(1, 254)}.${randomRange(2, 254)}`;
    } else {
      // 172.16.X.Y
      return `172.${randomRange(16, 31)}.${randomRange(1, 254)}.${randomRange(2, 254)}`;
    }
  } else {
    // Public range (excluding reserved ranges roughly)
    let firstOctet = randomRange(1, 223);
    while (firstOctet === 10 || firstOctet === 127 || firstOctet === 169 || firstOctet === 172 || firstOctet === 192) {
      firstOctet = randomRange(1, 223);
    }
    return `${firstOctet}.${randomRange(1, 254)}.${randomRange(1, 254)}.${randomRange(2, 254)}`;
  }
}

// Generate random Mac Address
export function randomMac() {
  const hexDigits = '0123456789abcdef';
  let mac = '';
  for (let i = 0; i < 6; i++) {
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    if (i < 5) mac += ':';
  }
  return mac;
}

// Generate random Hostname
export function randomHostname() {
  return randomChoice(HOSTNAMES);
}

// Generate random Username
export function randomUsername() {
  return randomChoice(USERNAMES);
}

// Generate random PID (Process ID)
export function randomPID() {
  return randomRange(100, 32768);
}

// Generate AWS style Account ID (12-digit number)
export function randomAWSAccount() {
  let acc = '';
  for (let i = 0; i < 12; i++) {
    acc += randomRange(0, 9).toString();
  }
  return acc;
}

// Generate AWS style EC2 Instance ID
export function randomEC2InstanceID() {
  const hex = '0123456789abcdef';
  let id = 'i-';
  // generate 17 hex characters (modern style)
  for (let i = 0; i < 17; i++) {
    id += hex[Math.floor(Math.random() * hex.length)];
  }
  return id;
}

// Generate AWS Role/AssumedRole Session ID
export function randomSessionID() {
  return `session-${randomRange(1000000000, 9999999999)}`;
}

// Generate generic UUID v4
export function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate request ID
export function randomRequestID() {
  return randomUUID();
}

// Generate Azure Activity ID / Operation ID
export function randomOperationID() {
  return randomUUID();
}

// Generate GCP Project ID
export function randomGCPProject() {
  const suffix = randomRange(100000, 999999);
  return `prod-gcp-project-${suffix}`;
}

// Generate region
export function randomRegion() {
  return randomChoice(REGIONS);
}

// Generate AZ
export function randomAZ(region = null) {
  const r = region || randomRegion();
  return `${r}${randomChoice(AZ_SUFFIXES)}`;
}

// Generate source/dest ports
export function randomPort(isServicePort = false) {
  if (isServicePort) {
    return randomChoice([22, 80, 443, 8080, 8443, 3306, 5432, 27017, 6379, 23]);
  }
  return randomRange(49152, 65535);
}

// Generate Linux Service Name
export function randomService() {
  return randomChoice(SERVICES);
}

// Generate HTTP method
export function randomHTTPMethod() {
  return randomChoice(HTTP_METHODS);
}

// Generate HTTP path
export function randomURLPath() {
  return randomChoice(URL_PATHS);
}

// Generate HTTP status code (weighted)
export function randomHTTPStatus() {
  const rand = Math.random();
  if (rand < 0.70) return 200;
  if (rand < 0.80) return 304;
  if (rand < 0.90) return 404;
  if (rand < 0.95) return 403;
  if (rand < 0.98) return 500;
  return 401;
}

// Generate random User Agent
export function randomUserAgent() {
  return randomChoice(USER_AGENTS);
}
