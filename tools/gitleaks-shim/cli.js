#!/usr/bin/env node
/**
 * Simple shim that ensures the official Gitleaks binary is available via npm exec.
 * Delegates all arguments to the downloaded binary exposed by gitleaks-secret-scanner.
 */
const { installGitleaks } = require("gitleaks-secret-scanner/lib/installer");
const { spawn } = require("child_process");

async function run() {
  try {
    const binaryPath = await installGitleaks({});
    const args = process.argv.slice(2);
    const child = spawn(binaryPath, args, { stdio: "inherit" });

    child.on("exit", (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
      } else {
        process.exit(code ?? 0);
      }
    });
  } catch (error) {
    console.error(`[GITLEAKS] No se pudo ejecutar la utilidad: ${error.message}`);
    process.exit(1);
  }
}

run();
