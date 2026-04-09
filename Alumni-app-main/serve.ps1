$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:5500/")
$listener.Start()
Write-Host "Frontend server started on http://localhost:5500"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    
    $basePath = "c:\Users\nitro\Documents\Alumni App"
    $filePath = Join-Path $basePath ($path.TrimStart("/"))
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        $mime = switch ($ext) {
            ".html" { "text/html" }
            ".css"  { "text/css" }
            ".js"   { "application/javascript" }
            default { "application/octet-stream" }
        }
        $context.Response.ContentType = $mime
        $context.Response.ContentLength64 = $content.Length
        $context.Response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $context.Response.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    $context.Response.Close()
}
