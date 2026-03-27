#Requires -Version 5.1

<#
.SYNOPSIS
    Advanced CLI Cache Monitoring and Cleanup Script
.DESCRIPTION
    Monitors CLI tool cache usage and performs intelligent cleanup
    Prevents disk filling issues automatically
#>

param(
    [switch]$MonitorOnly,
    [switch]$AggressiveCleanup,
    [int]$MaxCacheSizeGB = 2,
    [int]$RetentionDays = 7
)

# Configuration
$Config = @{
    OpenCode = @{
        Path = "$env:USERPROFILE\.local\share\opencode"
        MaxSizeGB = $MaxCacheSizeGB
        RetentionDays = $RetentionDays
        CriticalDirs = @('snapshot', 'tool-output', 'storage')
    }
    Kilo = @{
        Path = "$env:USERPROFILE\.local\share\kilo"
        MaxSizeGB = 1
        RetentionDays = 3
        CriticalDirs = @('tool-output', 'snapshot', 'cache')
    }
}

function Get-DirectorySize {
    param([string]$Path)
    if (!(Test-Path $Path)) { return 0 }
    return (Get-ChildItem $Path -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1GB
}

function Get-OldFiles {
    param([string]$Path, [int]$DaysOld)
    $cutoff = (Get-Date).AddDays(-$DaysOld)
    return Get-ChildItem $Path -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt $cutoff }
}

function Remove-OldFiles {
    param([string]$Path, [int]$DaysOld, [switch]$WhatIf)
    $oldFiles = Get-OldFiles -Path $Path -DaysOld $DaysOld
    if ($oldFiles) {
        Write-Host "Removing $($oldFiles.Count) old files from $Path"
        if ($WhatIf) {
            $oldFiles | Select-Object FullName, LastWriteTime
        } else {
            $oldFiles | Remove-Item -Force -ErrorAction SilentlyContinue
        }
    }
}

function Optimize-SQLiteDB {
    param([string]$DbPath)
    if (!(Test-Path $DbPath)) { return }

    Write-Host "Optimizing SQLite database: $DbPath"
    # Note: Would use sqlite3.exe if available
    # For now, just clean up WAL files if safe
    $walFile = "$DbPath-wal"
    $shmFile = "$DbPath-shm"

    if ((Test-Path $walFile) -and !(Test-Path "$DbPath-lock")) {
        Write-Host "Cleaning up WAL file: $walFile"
        Remove-Item $walFile -Force -ErrorAction SilentlyContinue
    }

    if (Test-Path $shmFile) {
        Write-Host "Cleaning up SHM file: $shmFile"
        Remove-Item $shmFile -Force -ErrorAction SilentlyContinue
    }
}

function Monitor-CacheUsage {
    Write-Host "`n=== CLI Cache Usage Report ===" -ForegroundColor Cyan
    Write-Host "Generated: $(Get-Date)" -ForegroundColor Gray

    $totalSize = 0
    foreach ($tool in $Config.Keys) {
        $toolConfig = $Config[$tool]
        $size = Get-DirectorySize -Path $toolConfig.Path

        Write-Host "`n$tool Cache:" -ForegroundColor Yellow
        Write-Host "  Location: $($toolConfig.Path)"
        Write-Host ("  Size: {0:N2} GB" -f $size) -ForegroundColor $(if ($size -gt $toolConfig.MaxSizeGB) { "Red" } else { "Green" })
        Write-Host ("  Limit: {0:N1} GB" -f $toolConfig.MaxSizeGB)
        Write-Host ("  Retention: {0} days" -f $toolConfig.RetentionDays)

        # Check critical directories
        foreach ($dir in $toolConfig.CriticalDirs) {
            $dirPath = Join-Path $toolConfig.Path $dir
            if (Test-Path $dirPath) {
                $dirSize = Get-DirectorySize -Path $dirPath
                $fileCount = (Get-ChildItem $dirPath -Recurse -File -ErrorAction SilentlyContinue).Count
                Write-Host ("  └─ $dir`: {0:N2} GB ({1} files)" -f $dirSize, $fileCount) -ForegroundColor Gray
            }
        }

        $totalSize += $size
    }

    Write-Host "`nTotal CLI Cache Size: {0:N2} GB" -f $totalSize -ForegroundColor $(if ($totalSize -gt 5) { "Red" } else { "Green" })

    # Disk space check
    $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter 'Caption="C:"'
    $freeGB = [math]::Round($disk.FreeSpace / 1GB, 2)
    $totalGB = [math]::Round($disk.Size / 1GB, 2)

    Write-Host "`nC: Drive Status:" -ForegroundColor Yellow
    Write-Host ("  Free: {0:N1} GB / {1:N0} GB ({2:N1}%)" -f $freeGB, $totalGB, ($freeGB / $totalGB * 100))

    if ($freeGB -lt 5) {
        Write-Host "  ⚠️ WARNING: Low disk space!" -ForegroundColor Red
    } elseif ($freeGB -lt 10) {
        Write-Host "  ⚠️ Notice: Disk space getting low" -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ Disk space OK" -ForegroundColor Green
    }
}

function Invoke-Cleanup {
    param([switch]$Aggressive)

    Write-Host "`n=== Starting CLI Cache Cleanup ===" -ForegroundColor Cyan

    foreach ($tool in $Config.Keys) {
        $toolConfig = $Config[$tool]
        Write-Host "`nCleaning $tool..." -ForegroundColor Yellow

        # Remove old files
        Remove-OldFiles -Path $toolConfig.Path -DaysOld $toolConfig.RetentionDays

        # Clean critical directories
        foreach ($dir in $toolConfig.CriticalDirs) {
            $dirPath = Join-Path $toolConfig.Path $dir
            if (Test-Path $dirPath) {
                Write-Host "  Cleaning $dir..." -ForegroundColor Gray
                Remove-OldFiles -Path $dirPath -DaysOld $(if ($Aggressive) { 1 } else { $toolConfig.RetentionDays })
            }
        }

        # Optimize databases
        $dbPath = Join-Path $toolConfig.Path "$tool.db"
        Optimize-SQLiteDB -DbPath $dbPath
    }

    # Clean Windows temp
    Write-Host "`nCleaning Windows temp files..." -ForegroundColor Yellow
    Remove-Item "$env:TEMP\*" -Force -ErrorAction SilentlyContinue
    Get-ChildItem "$env:TEMP" -Directory | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "`n✅ Cleanup completed!" -ForegroundColor Green
}

# Main execution
if ($MonitorOnly) {
    Monitor-CacheUsage
} else {
    Monitor-CacheUsage
    Invoke-Cleanup -Aggressive:$AggressiveCleanup
    Write-Host "`n" + "="*50
    Monitor-CacheUsage
}

Write-Host "`nScript completed at $(Get-Date)" -ForegroundColor Gray