# Test Flashcard API Endpoints

Write-Host "🧪 Testing Flashcard API Endpoints...`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api"

# Test 1: Login
Write-Host "1️⃣ Logging in..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@islamic-learning.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✓ Login successful`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
}

# Test 2: Get course flashcards
Write-Host "2️⃣ Testing GET /api/flashcards/course/:courseId" -ForegroundColor Yellow
$courseId = "cf1ba495-94cb-4bb1-a8f7-f6a4fb2ad6f2"
try {
    $courseFlashcards = Invoke-RestMethod -Uri "$baseUrl/flashcards/course/$courseId" -Method Get -Headers $headers
    Write-Host "✓ Retrieved $($courseFlashcards.Count) flashcards for course" -ForegroundColor Green
    if ($courseFlashcards.Count -gt 0) {
        Write-Host "  Sample: $($courseFlashcards[0].front.Substring(0, [Math]::Min(50, $courseFlashcards[0].front.Length)))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get unit flashcards
Write-Host "3️⃣ Testing GET /api/flashcards/unit/:unitId" -ForegroundColor Yellow
$unitId = "cba4c088-183c-4b97-a5ed-1ff86e0779c7"
try {
    $unitFlashcards = Invoke-RestMethod -Uri "$baseUrl/flashcards/unit/$unitId" -Method Get -Headers $headers
    Write-Host "✓ Retrieved $($unitFlashcards.Count) flashcards for unit" -ForegroundColor Green
    if ($unitFlashcards.Count -gt 0) {
        Write-Host "  Sample: $($unitFlashcards[0].front.Substring(0, [Math]::Min(50, $unitFlashcards[0].front.Length)))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get due flashcards
Write-Host "4️⃣ Testing GET /api/srs/flashcards/due" -ForegroundColor Yellow
try {
    $dueFlashcards = Invoke-RestMethod -Uri "$baseUrl/srs/flashcards/due" -Method Get -Headers $headers
    Write-Host "✓ Retrieved $($dueFlashcards.Count) due flashcards" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get study flashcards
Write-Host "5️⃣ Testing GET /api/srs/flashcards/study" -ForegroundColor Yellow
try {
    $studyFlashcards = Invoke-RestMethod -Uri "$baseUrl/srs/flashcards/study?limit=5" -Method Get -Headers $headers
    Write-Host "✓ Retrieved $($studyFlashcards.Count) study flashcards" -ForegroundColor Green
    if ($studyFlashcards.Count -gt 0) {
        Write-Host "  Sample: $($studyFlashcards[0].flashCard.front.Substring(0, [Math]::Min(50, $studyFlashcards[0].flashCard.front.Length)))..." -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ API endpoint tests completed!" -ForegroundColor Green
