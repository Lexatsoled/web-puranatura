param(
  [string]$BaseUrl = "https://web.purezanaturalis.com"
)

function Test-Endpoint {
  param([string]$Path)
  $url = "$BaseUrl$Path"
  try {
    $res = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 5 -TimeoutSec 20 -ErrorAction Stop
    [pscustomobject]@{ Path=$Path; Status=$res.StatusCode; Ok=$res.StatusCode -lt 400; Location=$res.Headers.Location }
  } catch {
    [pscustomobject]@{ Path=$Path; Status=($_.Exception.Response.StatusCode.value__); Ok=$false; Location=$null }
  }
}

function Get-Header {
  param([string]$Path)
  $url = "$BaseUrl$Path"
  $res = Invoke-WebRequest -Uri $url -Method Get -MaximumRedirection 5 -TimeoutSec 20 -ErrorAction SilentlyContinue
  [pscustomobject]@{
    Path=$Path
    Status=$res.StatusCode
    "content-type"=$res.Headers["Content-Type"]
    "cache-control"=$res.Headers["Cache-Control"]
    "x-content-type-options"=$res.Headers["X-Content-Type-Options"]
    "x-frame-options"=$res.Headers["X-Frame-Options"]
    "referrer-policy"=$res.Headers["Referrer-Policy"]
    "content-security-policy"=$res.Headers["Content-Security-Policy"]
  }
}

Write-Host "== Smoke: status codes =="
@("/","/tienda","/servicios","/sobre-nosotros","/contacto","/sistemas-sinergicos") | ForEach-Object { Test-Endpoint -Path $_ } | Format-Table -AutoSize

Write-Host "`n== Smoke: SEO endpoints =="
@("/robots.txt","/sitemap.xml","/manifest.json") | ForEach-Object { Test-Endpoint -Path $_ } | Format-Table -AutoSize

Write-Host "`n== Smoke: headers (home) =="
Get-Header -Path "/" | Format-List

Write-Host "`n== Smoke: canonical/OG checks =="
$home = Invoke-WebRequest -Uri "$BaseUrl/" -Method Get -MaximumRedirection 5 -TimeoutSec 20
$html = $home.Content
$canonical = [regex]::Match($html, '<link[^>]+rel=["'']canonical["''][^>]+href=["'']([^"'']+)["'']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Groups[1].Value
$ogImage = [regex]::Match($html, '<meta[^>]+property=["'']og:image["''][^>]+content=["'']([^"'']+)["'']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Groups[1].Value
[pscustomobject]@{ canonical=$canonical; ogImage=$ogImage } | Format-List

Write-Host "`n== Smoke: PWA files =="
@("/sw.js","/workbox-7aceb332.js","/offline.html") | ForEach-Object { Test-Endpoint -Path $_ } | Format-Table -AutoSize

Write-Host "`nDone."
