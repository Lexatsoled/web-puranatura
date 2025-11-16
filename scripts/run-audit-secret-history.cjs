#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const repoRoot = path.resolve(__dirname, "..");
const reportDir = path.join(repoRoot, "reports", "execution-2025-11-07");
const logPath = path.join(reportDir, "audit-output.log");

fs.mkdirSync(reportDir, { recursive: true });

let command;
let args;
if (process.platform === "win32") {
  command = "powershell.exe";
  args = [
    "-NoLogo",
    "-NonInteractive",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    path.join(__dirname, "audit-secret-history.ps1"),
    "-LogPath",
    logPath,
  ];
} else {
  command = "bash";
  args = [path.join(__dirname, "audit-secret-history.sh"), logPath];
}

const result = spawnSync(command, args, {
  stdio: "inherit",
  cwd: repoRoot,
});

process.exit(result.status ?? 0);
