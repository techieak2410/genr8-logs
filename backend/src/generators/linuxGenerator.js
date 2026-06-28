// Linux Log Generator Module
import { linuxTemplates } from '../templates/linuxTemplates.js';
import {
  randomChoice,
  randomRange,
  randomIP,
  randomHostname,
  randomUsername,
  randomPID,
  randomUUID,
  randomPort,
  randomService
} from '../utils/random.js';

// Format timestamp as BSD Syslog style: "Jul 14 10:22:31" in UTC
export function formatLinuxDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getUTCMonth()];
  const day = String(date.getUTCDate()).padStart(2, ' ');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${month} ${day} ${hours}:${minutes}:${seconds}`;
}

export function generateLinuxLog(type, severity, timestamp) {
  // Choose templates based on severity
  const availableTemplates = linuxTemplates[severity] || linuxTemplates.info;
  
  // Filter templates based on type
  // Type can be: 'linux-syslog', 'linux-ssh', 'linux-auth'
  let templates = availableTemplates;
  if (type === 'linux-ssh') {
    templates = availableTemplates.filter(t => t.service === 'sshd');
  } else if (type === 'linux-auth') {
    templates = availableTemplates.filter(t => ['sshd', 'sudo', 'useradd', 'userdel', 'passwd', 'systemd-logind'].includes(t.service));
  } else {
    // General syslog covers everything, but we can exclude high concentration of sshd if wanted.
  }

  // Fallback to general if no specific service templates match
  if (templates.length === 0) {
    templates = availableTemplates;
  }

  const selected = randomChoice(templates);
  const service = selected.service;
  let message = selected.template;

  // Variables for placeholders
  const username = randomUsername();
  const ip = randomIP();
  const port = randomPort();
  const pid = randomPID();
  const serviceName = randomService();
  const drive = `sd${randomChoice(['a', 'b', 'c'])}${randomRange(1, 4)}`;
  const uuid = randomUUID();
  const uid = randomRange(1000, 5000);
  const gid = uid;
  const session = randomRange(1, 1000);
  const address = 'ffff' + randomRange(10000000, 99999999).toString(16);
  const vm = randomRange(128000, 1024000);
  const rss = randomRange(16000, 256000);
  const code = randomChoice([1, 2, 127, 255]);
  const inode = randomRange(100000, 9999999);

  // Replace placeholders
  message = message
    .replace(/{username}/g, username)
    .replace(/{ip}/g, ip)
    .replace(/{port}/g, port)
    .replace(/{service}/g, serviceName)
    .replace(/{pid}/g, pid)
    .replace(/{drive}/g, drive)
    .replace(/{uuid}/g, uuid)
    .replace(/{uid}/g, uid)
    .replace(/{gid}/g, gid)
    .replace(/{session}/g, session)
    .replace(/{address}/g, address)
    .replace(/{vm}/g, vm)
    .replace(/{rss}/g, rss)
    .replace(/{code}/g, code)
    .replace(/{inode}/g, inode);

  const hostname = randomHostname();
  const dateStr = formatLinuxDate(timestamp);
  
  // Format: "Jul 14 10:22:31 web01 sshd[1822]: message"
  return `${dateStr} ${hostname} ${service}[${pid}]: ${message}`;
}
