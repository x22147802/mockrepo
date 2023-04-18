param (
    [Parameter(Mandatory=$true)]
    [string]$DjangoProjectPath
)

$ErrorActionPreference = 'Stop'

function Get-PythonFiles {
    param (
        [string]$Path
    )
    Get-ChildItem -Path $Path -Recurse -Include "*.py" -File | Select-Object -ExpandProperty FullName
}

try {
    $pythonFiles = Get-PythonFiles -Path $DjangoProjectPath
    $totalScore = 0
    $fileCount = 0

    foreach ($pythonFile in $pythonFiles) {
        $pylintOutput = pylint $pythonFile --load-plugins pylint_django --output-format=text
        $pylintScore = $pylintOutput -match "Your code has been rated at (.+?)\/10"

        if ($pylintScore) {
            $score = [double]($matches[1].Trim())
            Write-Host "Pylint Score for $($pythonFile): $score"
            $totalScore += $score
            $fileCount++
        } else {
            Write-Host "Error: Unable to calculate Pylint Score for $($pythonFile)"
        }
    }

    $averageScore = $totalScore / $fileCount
    Write-Host "`nAverage Pylint Score for the Django project: $averageScore"
} catch {
    Write-Host "Error: $($Error[0].ToString())"
    exit 1
}
