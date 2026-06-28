# genr8-logs 🚀

**genr8-logs** is a modern, responsive, and high-fidelity dummy log generator web application designed for cloud testing,cybersecurity practice, SIEM (Splunk, ELK, Datadog) testing, parser development, and log analysis. 

Instead of generating meaningless random text, it synthesizes production-grade logs that mimic real-world operating systems and cloud providers, maintaining strict chronological timeline consistency.

---

## 🌟 Key Features

* **High Performance Synthesis**: Generates up to **100,000 log lines in under 1.4 seconds** without blocking browser performance.
* **Unified Chronological Sorting**: Timestamps of mixed sources are computed progressively, ensuring records are written in realistic chronological order.
* **10 Supported Log Formats**:
  * **System (Linux)**: Syslog, Authentication logs, SSH (`sshd` login states), Cron jobs, Kernel diagnostics, Systemd daemon alerts.
  * **AWS**: CloudTrail API Audit Logs (JSON), VPC Flow Logs (space-delimited network packets), EC2 status events.
  * **Azure**: Active Directory Sign-in logs (JSON authentication states), ARM Activity logs (JSON subscription events).
  * **GCP**: Stackdriver Cloud Audit logs (Admin/Data access JSON logs), Compute Engine guest agent events.
* **Cybersecurity Console Dashboard**:
  * Monospace log preview terminal with syntax-highlighted warnings, errors, and critical logs.
  * Interactive keyword search with inline match highlighting.
  * Live filter options to hide non-matching noise rows.
  * Rapid clipboard copy of previews and direct download capability for the full files.
  * Built-in API health indicator.
* **Efficient Streaming & Auto-Cleanup**: The backend creates temporary download logs and streams them to the client on demand, with a background cleaner automatically purging temporary logs.

---

## 🛠️ Architecture

* **Frontend**: React (Vite) + Tailwind CSS v4 + Lucide Icons + React Context API
* **Backend**: Node.js + Express (ES Modules)
* **Randomization Engine**: Custom written IP, MAC, UUID, Hostname, Username, Port, and AWS/Azure/GCP ID generator.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/techieak2410/genr8-logs.git
   cd genr8-logs
   ```

2. **Start the Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend API daemon starts at `http://localhost:5000`.

3. **Start the Frontend Client**:
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The client will open in your browser at `http://localhost:5173/`.

---

## 📊 Performance Benchmarks
* **100 lines**: ~4.7 ms
* **1,000 lines**: ~13.7 ms
* **10,000 lines**: ~114 ms
* **100,000 lines**: ~1.34 seconds (Approx memory usage: 70MB delta)

---

## 🛡️ License
This project is licensed under the MIT License - see the LICENSE file for details.

---

*Made with ♥ by **techieak**.*
