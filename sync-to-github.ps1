param(
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$git = "C:\Program Files\Git\cmd\git.exe"
$remoteUrl = "https://github.com/mayatenzer07-art/Memory-Monday-Digest-blog-code.git"
$branch = "main"
$logDirectory = Join-Path $env:LOCALAPPDATA "MemoryMondayDigest"
$logFile = Join-Path $logDirectory "sync.log"

function Write-SyncLog {
    param([string]$Message)

    if (-not (Test-Path -LiteralPath $logDirectory)) {
        New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
    }

    $line = "{0} {1}{2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message, [Environment]::NewLine
    [System.IO.File]::AppendAllText($logFile, $line)
}

function Invoke-Git {
    param([string[]]$GitArguments)

    $output = & $git -C $projectRoot @GitArguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArguments -join ' ') failed: $($output -join ' ')"
    }

    return $output
}

if (-not (Test-Path -LiteralPath $git -PathType Leaf)) {
    throw "Git was not found at $git."
}

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot ".git") -PathType Container)) {
    throw "No Git repository was found in $projectRoot."
}

$configuredRemote = (Invoke-Git -GitArguments @("remote", "get-url", "origin") | Select-Object -Last 1).Trim()
if ($configuredRemote -ne $remoteUrl) {
    throw "The origin remote does not match the configured project repository."
}

$currentBranch = (Invoke-Git -GitArguments @("branch", "--show-current") | Select-Object -Last 1).Trim()
if ($currentBranch -ne $branch) {
    throw "Expected branch '$branch', but found '$currentBranch'."
}

if ($CheckOnly) {
    Write-Output "Git sync configuration is valid."
    exit 0
}

$env:GIT_TERMINAL_PROMPT = "0"
$env:GCM_INTERACTIVE = "never"

try {
    Invoke-Git -GitArguments @("add", "--all") | Out-Null

    & $git -C $projectRoot diff --cached --quiet
    $diffExitCode = $LASTEXITCODE
    if ($diffExitCode -eq 1) {
        $commitMessage = "Automatic sync {0}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        Invoke-Git -GitArguments @("commit", "-m", $commitMessage) | Out-Null
        Write-SyncLog "Created commit: $commitMessage"
    } elseif ($diffExitCode -ne 0) {
        throw "git diff --cached --quiet failed with exit code $diffExitCode."
    }

    Invoke-Git -GitArguments @("push", "origin", $branch) | Out-Null
} catch {
    Write-SyncLog "Sync failed: $($_.Exception.Message)"
    throw
}
