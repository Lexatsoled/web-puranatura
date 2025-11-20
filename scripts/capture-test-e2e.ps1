# Capture E2E output and exit code
# Usage: run this from the repository root in PowerShell:
#   .\scripts\capture-test-e2e.ps1
# Optional parameters: -LogFile and -ExitFile
Param(
    [string]$LogFile = "test-e2e-output.log",
    [string]$ExitFile = "test-e2e-exitcode.txt"
)

Write-Host "Running 'npm run test:e2e' and saving output to $LogFile..."

# Run the e2e script and tee both stdout and stderr to the log file
npm run test:e2e *>&1 | Tee-Object -FilePath $LogFile

# Capture the exit code of the last process (npm)
$exitCode = $LASTEXITCODE

Write-Host "Process finished with exit code: $exitCode"

# Save the exit code to a file
$exitCode | Out-File -FilePath $ExitFile -Encoding utf8

Write-Host "Saved output to: $LogFile"
Write-Host "Saved exit code to: $ExitFile"

Write-Host "You can now share the two files or paste their contents here."
