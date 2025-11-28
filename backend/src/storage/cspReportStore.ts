import fs from 'fs';
import path from 'path';

const reportsDir = path.join(process.cwd(), 'backend', 'reports');
const reportsFile = path.join(reportsDir, 'csp-reports.ndjson');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

export const appendCspReport = async (payload: unknown) => {
  const row = JSON.stringify({ receivedAt: new Date().toISOString(), payload });
  await fs.promises.appendFile(reportsFile, row + '\n', 'utf8');
};

export const readCspReports = async () => {
  try {
    const content = await fs.promises.readFile(reportsFile, 'utf8');
    return content
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l));
  } catch (err) {
    return [];
  }
};

export default { appendCspReport, readCspReports };
