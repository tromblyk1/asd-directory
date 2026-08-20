# Register Windows Task Scheduler jobs for the events pipeline.
#
# Run this script ONCE, from an elevated PowerShell:
#   powershell -ExecutionPolicy Bypass -File install_pipeline_tasks.ps1
#
# Creates two scheduled tasks:
#   FloridaAutismEvents-Tier1  daily at 06:00  (operator feeds — cheap)
#   FloridaAutismEvents-Tier2  Sunday 08:00     (web research — paid)
#
# Re-running the script overwrites existing tasks with the same name.

[CmdletBinding()]
param(
  [string]$NodeExe = (Get-Command node -ErrorAction SilentlyContinue).Path
)

$ErrorActionPreference = 'Stop'

if (-not $NodeExe) {
  Write-Error "node.exe not found on PATH. Install Node.js or pass -NodeExe 'C:\Path\to\node.exe'."
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Pipeline  = Join-Path $ScriptDir 'pipeline.js'

if (-not (Test-Path $Pipeline)) {
  Write-Error "pipeline.js not found at $Pipeline"
}

function Register-PipelineTask {
  param(
    [string]$Name,
    [string]$Args,
    [object]$Trigger,
    [string]$Description
  )

  $action = New-ScheduledTaskAction `
    -Execute $NodeExe `
    -Argument "`"$Pipeline`" $Args" `
    -WorkingDirectory $ScriptDir

  $settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -DontStopIfGoingOnBatteries `
    -AllowStartIfOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

  $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Limited

  Register-ScheduledTask `
    -TaskName $Name `
    -Action $action `
    -Trigger $Trigger `
    -Settings $settings `
    -Principal $principal `
    -Description $Description `
    -Force | Out-Null

  Write-Host "Registered: $Name"
}

# Tier 1: every day at 06:00.
$tier1Trigger = New-ScheduledTaskTrigger -Daily -At 6:00am
Register-PipelineTask `
  -Name 'FloridaAutismEvents-Tier1' `
  -Args '--tier1' `
  -Trigger $tier1Trigger `
  -Description 'Pull events from operator-curated iCal/RSS feeds (feeds.json) and publish to Supabase.'

# Tier 2: every Sunday at 08:00.
$tier2Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 8:00am
Register-PipelineTask `
  -Name 'FloridaAutismEvents-Tier2' `
  -Args '--tier2' `
  -Trigger $tier2Trigger `
  -Description 'Anthropic web-search research for Florida autism events; publish to Supabase.'

Write-Host ""
Write-Host "Done. View or manage tasks in Task Scheduler under 'Task Scheduler Library'."
Write-Host "To remove:  Unregister-ScheduledTask -TaskName 'FloridaAutismEvents-Tier1' -Confirm:`$false"
