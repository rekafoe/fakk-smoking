# Windows: stop Next.js dev locks, free ports 3000/3001, remove .next
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/clean-win.ps1
# From repo root: npm run clean:win

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$Ports = @(3000, 3001)
$Stopped = @()

function Stop-PortListeners {
    param([int[]]$PortList)
    foreach ($port in $PortList) {
        try {
            $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        } catch {
            # Get-NetTCPConnection may require admin on some setups; fall back to netstat
            $conns = @()
        }
        foreach ($c in $conns) {
            $processId = $c.OwningProcess
            if ($processId -and $processId -notin $Stopped) {
                Write-Host "Stopping PID $processId (port $port)..."
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                $script:Stopped += $processId
            }
        }
    }
}

function Stop-NodeOnDevPorts {
    # Fallback when Get-NetTCPConnection is empty but node still holds the port
    $lines = netstat -ano 2>$null | Select-String "LISTENING"
    foreach ($port in $Ports) {
        $pattern = ":$port\s"
        foreach ($line in $lines) {
            if ($line -match $pattern) {
                $parts = ($line -replace '\s+', ' ').ToString().Trim().Split(' ')
                $processId = [int]$parts[-1]
                if ($processId -gt 0 -and $processId -notin $Stopped) {
                    $proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
                    if ($proc -and ($proc.ProcessName -match 'node|next')) {
                        Write-Host "Stopping PID $processId via netstat (port $port)..."
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                        $script:Stopped += $processId
                    }
                }
            }
        }
    }
}

Write-Host "=== clean-win: $ProjectRoot ==="
Stop-PortListeners -PortList $Ports
Stop-NodeOnDevPorts
Start-Sleep -Seconds 1

$cacheDirs = @(
    (Join-Path $ProjectRoot ".next"),
    (Join-Path $ProjectRoot "node_modules\.cache")
)

foreach ($dir in $cacheDirs) {
    if (-not (Test-Path $dir)) { continue }
    $label = Split-Path $dir -Leaf
    if ($label -eq ".next") {
        $maxAttempts = 5
        for ($i = 1; $i -le $maxAttempts; $i++) {
            try {
                Remove-Item -LiteralPath $dir -Recurse -Force -ErrorAction Stop
                Write-Host "Removed .next"
                break
            } catch {
                if ($i -eq $maxAttempts) {
                    Write-Warning "Could not remove .next after $maxAttempts attempts: $_"
                    Write-Host "Close Cursor terminals running 'next dev', kill node.exe in Task Manager, then run: npm run clean:win"
                    exit 1
                }
                Write-Host "Retry $i/$maxAttempts removing .next..."
                Start-Sleep -Seconds 2
                Stop-PortListeners -PortList $Ports
            }
        }
    } else {
        try {
            Remove-Item -LiteralPath $dir -Recurse -Force -ErrorAction Stop
            Write-Host "Removed $label"
        } catch {
            Write-Warning "Could not remove ${label}: $_"
        }
    }
}

if (-not (Test-Path (Join-Path $ProjectRoot ".next"))) {
    Write-Host ".next not present (already clean)"
}

Write-Host "Done. Start dev: npm run dev  (or npm run dev:clean:win)"
