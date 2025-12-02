param(
  [int]$Pr = 32,
  [int]$IntervalSeconds = 20,
  [int]$MaxIterations = 720
)

$i = 0
while ($i -lt $MaxIterations) {
  $i++
  try {
    $data = gh pr view $Pr --json statusCheckRollup | ConvertFrom-Json
  } catch {
    Write-Host "Failed to query PR $Pr" -ForegroundColor Red
    Start-Sleep -Seconds $IntervalSeconds
    continue
  }
  $rollup = $data.statusCheckRollup
  if (-not $rollup) { Write-Host "poll #$i: no checks yet"; Start-Sleep -Seconds $IntervalSeconds; continue }

  $count = $rollup.Count
  Write-Host "poll #$i: checking $count checks at $(Get-Date)"

  $inProgress = $rollup | Where-Object { $_.status -eq 'IN_PROGRESS' }
  $notCompleted = $rollup | Where-Object { $_.status -ne 'COMPLETED' }
  $failed = $rollup | Where-Object { $_.status -eq 'COMPLETED' -and $_.conclusion -ne 'SUCCESS' }

  if ($notCompleted.Count -eq 0 -and $failed.Count -eq 0) {
    Write-Host 'All checks completed and SUCCESS -> PR green' -ForegroundColor Green
    break
  }

  if ($notCompleted.Count -eq 0 -and $failed.Count -gt 0) {
    Write-Host 'Checks finished but some failed:' -ForegroundColor Red
    $failed | Format-Table name,workflowName,conclusion,detailsUrl
    break
  }

  Write-Host "InProgress: $($inProgress.Count)  NotCompleted: $($notCompleted.Count)  FailedSoFar: $($failed.Count)"
  Start-Sleep -Seconds $IntervalSeconds
}

Write-Host 'Watcher ended'
