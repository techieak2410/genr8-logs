import { generateLogs } from './src/generators/index.js';

console.log('--- Testing Log Generation Performance ---');

const logTypes = [
  'linux-syslog', 'linux-ssh', 'linux-auth',
  'aws-cloudtrail', 'aws-vpcflow', 'aws-ec2',
  'azure-signin', 'azure-activity',
  'gcp-audit', 'gcp-gce'
];

try {
  const sizes = [100, 1000, 10000, 100000];

  for (const size of sizes) {
    const start = performance.now();
    const memoryBefore = process.memoryUsage().heapUsed;

    const result = generateLogs({
      logTypes,
      numLines: size,
      timestampOption: 'day'
    });

    const end = performance.now();
    const memoryAfter = process.memoryUsage().heapUsed;
    const timeTakenMs = (end - start).toFixed(2);
    const heapUsedMb = ((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2);

    console.log(`Generated ${size.toLocaleString().padStart(7)} lines in ${timeTakenMs.padStart(6)} ms (Approx memory delta: ${heapUsedMb.padStart(5)} MB)`);

    // Verify properties
    if (result.length !== size) {
      throw new Error(`Size mismatch: expected ${size}, got ${result.length}`);
    }

    // Check chronological order of the first 5 logs and last 5 logs (if there are enough logs)
    if (size >= 100) {
      // Find timestamps in the logs
      // Simple regex parser for ISO-8601 timestamps and BSD timestamps
      const getTimestampFromLine = (line) => {
        // Try parsing ISO date e.g. "2026-06-28T..." or "[2026-06-28T...]"
        const isoMatch = line.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        if (isoMatch) return new Date(isoMatch[0] + 'Z').getTime();

        // Try parsing BSD date e.g. "Jun 28 11:08:03"
        const bsdMatch = line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d+)\s+(\d{2}):(\d{2}):(\d{2})/);
        if (bsdMatch) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthIndex = months.indexOf(bsdMatch[1]);
          const day = parseInt(bsdMatch[2], 10);
          const hours = parseInt(bsdMatch[3], 10);
          const minutes = parseInt(bsdMatch[4], 10);
          const seconds = parseInt(bsdMatch[5], 10);
          const year = new Date().getUTCFullYear();
          return Date.UTC(year, monthIndex, day, hours, minutes, seconds);
        }

        // VPC Flow logs timestamps (second last and third last fields: start/end epoch)
        const parts = line.split(' ');
        if (parts.length >= 14 && /^\d+$/.test(parts[10])) {
          return parseInt(parts[10], 10) * 1000;
        }

        return null;
      };

      let prevTime = 0;
      let orderOk = true;
      let parsedCount = 0;

      for (let i = 0; i < result.length; i++) {
        const time = getTimestampFromLine(result[i]);
        if (time) {
          parsedCount++;
          if (prevTime && time < prevTime) {
            orderOk = false;
            console.log(`Order mismatch at index ${i}: current time (${new Date(time).toISOString()}) is earlier than previous (${new Date(prevTime).toISOString()})`);
            break;
          }
          prevTime = time;
        }
      }
      console.log(`  Chronological check: ${orderOk ? 'PASSED' : 'FAILED'} (Parsed ${parsedCount}/${size} lines)`);
    }
  }

  console.log('--- Test Run Successfully Completed ---');

} catch (err) {
  console.error('Test run failed:', err);
}
