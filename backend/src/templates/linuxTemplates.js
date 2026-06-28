// Linux Event Templates

export const linuxTemplates = {
  info: [
    {
      service: 'sshd',
      template: 'Accepted password for {username} from {ip} port {port} ssh2'
    },
    {
      service: 'sshd',
      template: 'Connection closed by {ip} port {port} [preauth]'
    },
    {
      service: 'systemd',
      template: 'Started {service} Service.'
    },
    {
      service: 'systemd',
      template: 'Stopping {service} Service...'
    },
    {
      service: 'systemd',
      template: 'Stopped {service} Service.'
    },
    {
      service: 'cron',
      template: '({username}) CMD (python3 /usr/local/bin/cleanup.py > /dev/null 2>&1)'
    },
    {
      service: 'cron',
      template: '({username}) CMD (/usr/local/bin/backup.sh)'
    },
    {
      service: 'kernel',
      template: 'EXT4-fs ({drive}): mounted filesystem with ordered data mode. Opts: (null)'
    },
    {
      service: 'kernel',
      template: 'Initializing cgroup subsys cpuset'
    },
    {
      service: 'kernel',
      template: 'Command line: BOOT_IMAGE=/vmlinuz-5.15.0-88-generic root=UUID={uuid} ro quiet splash'
    },
    {
      service: 'systemd-logind',
      template: 'New session {session} of user {username}.'
    },
    {
      service: 'systemd-logind',
      template: 'Removed session {session}.'
    },
    {
      service: 'useradd',
      template: 'new user: name={username}, UID={uid}, GID={gid}, home=/home/{username}, shell=/bin/bash'
    },
    {
      service: 'passwd',
      template: 'password changed for {username}'
    }
  ],
  warning: [
    {
      service: 'sshd',
      template: 'Failed password for invalid user {username} from {ip} port {port} ssh2'
    },
    {
      service: 'sshd',
      template: 'Failed password for {username} from {ip} port {port} ssh2'
    },
    {
      service: 'sshd',
      template: 'Invalid user {username} from {ip} port {port}'
    },
    {
      service: 'sshd',
      template: 'Received disconnect from {ip} port {port}:11: user request [preauth]'
    },
    {
      service: 'cron',
      template: '({username}) CMD (db_sync.sh) - process took too long (> 300s)'
    },
    {
      service: 'kernel',
      template: 'ACPI Warning: \\_SB.PCI0.PEG0.PEGP._DSM: Argument count mismatch - Found 4, Expected 3 (20210730/nsarguments-162)'
    },
    {
      service: 'kernel',
      template: 'audit: active_port_scan detected on interface eth0 from {ip}'
    },
    {
      service: 'sudo',
      template: '{username} : TTY=pts/1 ; PWD=/home/{username} ; USER=root ; COMMAND=/usr/bin/apt-get update'
    }
  ],
  error: [
    {
      service: 'sshd',
      template: 'Connection reset by {ip} port {port} [preauth]'
    },
    {
      service: 'systemd',
      template: '{service}.service: Failed with result \'exit-code\'.'
    },
    {
      service: 'systemd',
      template: '{service}.service: Main process exited, code=exited, status={code}/FAILURE'
    },
    {
      service: 'cron',
      template: '({username}) CMD (/usr/bin/rsync -a /var/www {ip}:/backup) - failed with status {code}'
    },
    {
      service: 'kernel',
      template: 'EXT4-fs error (device {drive}): ext4_lookup: deleted inode referenced: {inode}'
    },
    {
      service: 'sudo',
      template: '{username} : 3 incorrect password attempts ; TTY=pts/0 ; PWD=/home/{username} ; USER=root ; COMMAND=/usr/bin/cat /etc/shadow'
    },
    {
      service: 'userdel',
      template: 'user \'{username}\' is currently logged in, deletion failed'
    }
  ],
  critical: [
    {
      service: 'kernel',
      template: 'BUG: unable to handle kernel paging request at {address}'
    },
    {
      service: 'kernel',
      template: 'Kernel panic - not syncing: Attempted to kill init! exitcode=0x00000007'
    },
    {
      service: 'kernel',
      template: 'Out of memory: Killed process {pid} ({service}) total-vm:{vm}kB, anon-rss:{rss}kB, file-rss:0kB'
    },
    {
      service: 'systemd',
      template: 'Freezing execution due to critical system failure.'
    }
  ]
};
