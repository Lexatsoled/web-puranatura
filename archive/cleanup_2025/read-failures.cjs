const fs = require('fs');
const report = JSON.parse(fs.readFileSync('test-results-6.json', 'utf8'));

report.testResults.forEach(file => {
  if (file.status === 'failed') {
    console.log(`\n📄 ${file.name}`);
    file.assertionResults.forEach(test => {
      if (test.status === 'failed') {
        console.log(`  ❌ ${test.title}`);
        test.failureMessages.forEach(msg => {
            // Trim stack trace to verify just the message clearly
            console.log(`     Error: ${msg.split('\n')[0]}`);
        });
      }
    });
  }
});
