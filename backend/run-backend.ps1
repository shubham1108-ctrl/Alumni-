# Check if Java is installed
java -version 2>$null
if ($LASTEXITCODE -ne 0 -and $? -eq $false) {
    Write-Host "Error: Java 17+ is required but not found. Please install Java and try again." -ForegroundColor Red
    exit
}

# Check for Maven
$mavenExists = Get-Command mvn -ErrorAction SilentlyContinue
if ($mavenExists) {
    Write-Host "Maven found. Running application..." -ForegroundColor Green
    mvn spring-boot:run
} else {
    Write-Host "Maven not found in PATH. Attempting to use Maven Wrapper..." -ForegroundColor Yellow
    
    # Check if we need to download the wrapper jar
    $wrapperJar = ".mvn/wrapper/maven-wrapper.jar"
    if (!(Test-Path $wrapperJar)) {
        Write-Host "Downloading Maven Wrapper..." -ForegroundColor Cyan
        New-Item -ItemType Directory -Force -Path ".mvn/wrapper"
        $url = "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
        Invoke-WebRequest -Uri $url -OutFile $wrapperJar
    }

    # Create a simple mvnw.cmd if it doesn't exist
    if (!(Test-Path "mvnw.cmd")) {
        $mvnwContent = @"
@REM Simplified mvnw.cmd
@setlocal
@set DIRNAME=%~dp0
@set WRAPPER_JAR="%DIRNAME%.mvn\wrapper\maven-wrapper.jar"
@set WRAPPER_PROPERTIES="%DIRNAME%.mvn\wrapper\maven-wrapper.properties"
java -Dmaven.multiModuleProjectDirectory="%DIRNAME%." -cp %WRAPPER_JAR% org.apache.maven.wrapper.MavenWrapperMain %*
"@
        $mvnwContent | Out-File -FilePath "mvnw.cmd" -Encoding ascii
    }

    Write-Host "Running application via Maven Wrapper..." -ForegroundColor Green
    
    $javaArgs = @(
        "-Dmaven.multiModuleProjectDirectory=$PWD",
        "-cp",
        ".mvn/wrapper/maven-wrapper.jar",
        "org.apache.maven.wrapper.MavenWrapperMain",
        "spring-boot:run"
    )
    
    & java $javaArgs
}
