param(
    [string]$Distro,
    [switch]$Detached,
    [switch]$NoBuild
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path $PSScriptRoot).Path

function Convert-WindowsPathToWslPath {
    param(
        [string]$WindowsPath
    )

    if ($WindowsPath -match '^([A-Za-z]):\\(.*)$') {
        $drive = $matches[1].ToLowerInvariant()
        $rest = $matches[2] -replace '\\', '/'
        return "/mnt/$drive/$rest"
    }

    throw "Unsupported Windows path format: $WindowsPath"
}

function Get-WslPath {
    param(
        [string]$WindowsPath,
        [string]$TargetDistro
    )

    $args = @()
    if ($TargetDistro) {
        $args += "-d"
        $args += $TargetDistro
    }
    $args += "wslpath"
    $args += "-a"
    $args += $WindowsPath

    $result = & wsl.exe @args
    if ($LASTEXITCODE -eq 0) {
        return ($result | Out-String).Trim()
    }

    return Convert-WindowsPathToWslPath -WindowsPath $WindowsPath
}

function Invoke-WslShell {
    param(
        [string]$CommandText,
        [string]$TargetDistro
    )

    $args = @()
    if ($TargetDistro) {
        $args += "-d"
        $args += $TargetDistro
    }
    $args += "bash"
    $args += "-lc"
    $args += $CommandText

    & wsl.exe @args
    exit $LASTEXITCODE
}

$linuxRepoRoot = Get-WslPath -WindowsPath $repoRoot -TargetDistro $Distro

$composeArgs = @("docker", "compose", "up")
if (-not $NoBuild) {
    $composeArgs += "--build"
}
if ($Detached) {
    $composeArgs += "-d"
}

$composeCommand = ($composeArgs -join " ")
$shellCommand = "cd '$linuxRepoRoot' && $composeCommand"

Invoke-WslShell -CommandText $shellCommand -TargetDistro $Distro
