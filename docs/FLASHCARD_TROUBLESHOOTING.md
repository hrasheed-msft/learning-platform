# Flashcard Feature - Troubleshooting Guide

**Last Updated:** December 30, 2025

## Issue: "Unable to Load Flashcards" Error

If you're seeing this error when clicking on the Flashcards link in a unit, follow these steps:

---

## Step 1: Verify You're Logged In ✅

The flashcard feature requires authentication to track your progress.

**Check:**
1. Look for your name/profile in the top-right corner
2. If not logged in, click "Login" and sign in
3. Try accessing the flashcards again

**Test Account:**
- Email: `admin@islamic-learning.com`
- Password: `admin123`

---

## Step 2: Check Browser Console for Errors

1. Open Developer Tools (Press `F12`)
2. Click the "Console" tab
3. Look for error messages (in red)

### Common Errors and Solutions:

#### Error: "401 Unauthorized" or "No token provided"
**Solution:** You need to log in
```
1. Log out completely (if partially logged in)
2. Clear browser localStorage (F12 → Application → Local Storage → Clear)
3. Log in again
4. Try accessing flashcards
```

#### Error: "Network Error" or "ERR_CONNECTION_REFUSED"
**Solution:** Backend server is not running
```bash
# In terminal, navigate to backend folder
cd islamic-learning-platform/backend

# Start the backend server
npm run dev

# You should see:
# "Server running on port 3000"
# "Connected to PostgreSQL database"
```

#### Error: "404 Not Found"
**Solution:** Check the URL path
```
Correct URLs:
✅ /courses/{courseId}/units/{unitId}/flashcards
✅ /courses/{courseId}/flashcards

Incorrect URLs:
❌ /flashcards (missing course/unit context)
❌ /unit/flashcards (missing IDs)
```

---

## Step 3: Verify Backend is Running

**Check Backend Health:**

In PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/health"
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T..."
}
```

**If Backend is NOT Running:**
```bash
# Navigate to backend
cd islamic-learning-platform/backend

# Start server
npm run dev

# Keep this terminal open
```

---

## Step 4: Verify Frontend is Running

**Check Frontend:**
- Open browser to `http://localhost:5174` (or the port shown in terminal)
- You should see the Islamic Learning Platform homepage

**If Frontend is NOT Running:**
```bash
# Navigate to frontend
cd islamic-learning-platform/frontend

# Start development server
npm run dev

# Open browser to the URL shown (usually http://localhost:5173 or 5174)
```

---

## Step 5: Verify Flashcards Exist in Database

**Run Verification Script:**

```bash
# Navigate to backend
cd islamic-learning-platform/backend

# Run verification
npx ts-node prisma/verify-flashcards.ts
```

**Expected Output:**
```
✓ Found course: Advanced Sarf - Arabic Morphology
  Course ID: cf1ba495-94cb-4bb1-a8f7-f6a4fb2ad6f2
  Total units: 7

📚 Unit: Introduction to Sarf & The Trilateral Root System
   Flashcards: 6

✅ Total flashcards found: 25
```

**If NO Flashcards Found:**
```bash
# Run seed script
cd islamic-learning-platform/backend
npx ts-node prisma/seed-sarf-flashcards.ts

# You should see:
# "✅ Successfully created 25 flashcards for Sarf course!"
```

---

## Step 6: Check Network Requests in Browser

1. Open Developer Tools (`F12`)
2. Go to "Network" tab
3. Click on Flashcards link in the app
4. Watch for API requests

**Look for:**
```
Request: GET /api/v1/courses/{courseId}/units/{unitId}/flashcards
Status: Should be 200 (green)
```

**Common Issues:**

| Status Code | Meaning | Solution |
|------------|---------|----------|
| 200 | Success | Flashcards should load |
| 401 | Unauthorized | Log in again |
| 404 | Not Found | Check URL/IDs are correct |
| 500 | Server Error | Check backend console for errors |

---

## Step 7: Verify Course and Unit IDs

**Important:** Only the first 5 units of the Sarf course have flashcards currently.

**Check which unit you're accessing:**

1. In the browser URL, note the IDs:
   ```
   /courses/cf1ba495-94cb-4bb1-a8f7-f6a4fb2ad6f2/units/cba4c088-183c-4b97-a5ed-1ff86e0779c7/flashcards
           └─ Course ID                                └─ Unit ID
   ```

2. Compare with seeded units:
   ```
   ✅ Unit 1: cba4c088-183c-4b97-a5ed-1ff86e0779c7 (6 flashcards)
   ✅ Unit 2: eed13eb2-03e4-4d1d-ad75-37b8afe0fdea (5 flashcards)
   ✅ Unit 3: f4e33361-e845-4bda-85e8-b84773ade5c6 (5 flashcards)
   ✅ Unit 4: b2787037-9380-4f1a-8e11-b6593c783887 (5 flashcards)
   ✅ Unit 5: 1aaf304d-8184-4e30-a21b-7a9c0de23ea8 (4 flashcards)
   ❌ Unit 6: 20237792-9e65-4744-b0da-9e3699076841 (NO flashcards)
   ❌ Unit 7: 6b0677f1-b480-430d-9291-9a30dd583652 (NO flashcards)
   ```

**If accessing Unit 6 or 7:**
- Expected behavior: "No flashcards available"
- Not an error - these units don't have flashcards yet

---

## Step 8: Clear Browser Cache and Cookies

Sometimes cached data can cause issues.

**Clear Cache:**
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cached images and files"
3. Select "Cookies and other site data"
4. Click "Clear data"
5. Refresh the page

**Or use Incognito/Private Mode:**
1. Open new Incognito window (`Ctrl+Shift+N`)
2. Navigate to `http://localhost:5174`
3. Log in
4. Try accessing flashcards

---

## Step 9: Check Backend Console for Errors

Look at the terminal where the backend is running.

**Common Backend Errors:**

### "Error: connect ECONNREFUSED"
**Cause:** Database not running
**Solution:**
```bash
# Check if PostgreSQL is running
# Windows:
services.msc  # Look for "PostgreSQL"

# Or check environment variables
echo $env:DATABASE_URL

# Make sure it points to a running PostgreSQL instance
```

### "PrismaClientKnownRequestError"
**Cause:** Database schema mismatch
**Solution:**
```bash
cd islamic-learning-platform/backend

# Reset database and reseed
npx prisma migrate reset --force
npx prisma migrate dev
npx ts-node prisma/seed.ts
npx ts-node prisma/seed-sarf-flashcards.ts
```

---

## Step 10: Restart Everything

When all else fails, restart the entire stack:

```bash
# 1. Stop all running processes
#    - Press Ctrl+C in all terminal windows
#    - Close all terminals

# 2. Start Backend
cd islamic-learning-platform/backend
npm run dev
# Wait for: "Server running on port 3000"

# 3. Start Frontend (in new terminal)
cd islamic-learning-platform/frontend
npm run dev
# Wait for: "Local: http://localhost:5174"

# 4. Open browser to http://localhost:5174

# 5. Log in with test account

# 6. Navigate to: Courses → Advanced Sarf → Unit 1 → Flashcards
```

---

## Still Having Issues?

### Check the Test Results Document

See `FLASHCARD_TEST_RESULTS.md` for detailed verification that everything is working.

### Run the Full Test Suite

```bash
# Backend tests
cd islamic-learning-platform/backend
npm test

# Should see: 79/98 tests passing (81%)
```

### Verify Database Directly

```bash
# Open Prisma Studio
cd islamic-learning-platform/backend
npx prisma studio

# Browser opens to http://localhost:5555
# Navigate to: FlashCard table
# You should see 25 records
```

---

## Quick Checklist

Before reporting an issue, verify:

- [ ] Backend is running on port 3000
- [ ] Frontend is running on port 5173 or 5174
- [ ] You are logged in
- [ ] Database has flashcards (run verify script)
- [ ] You're accessing a unit that has flashcards (Units 1-5)
- [ ] No errors in browser console
- [ ] No errors in backend console
- [ ] Network requests return 200 status

---

## Most Common Issues and Quick Fixes

### Issue: "Unable to Load Flashcards"
**Quick Fix:**
1. Make sure you're logged in
2. Check you're accessing Unit 1-5 (not 6 or 7)
3. Refresh the page

### Issue: No flashcards show up
**Quick Fix:**
```bash
cd islamic-learning-platform/backend
npx ts-node prisma/seed-sarf-flashcards.ts
```

### Issue: 401 Unauthorized
**Quick Fix:**
1. Log out
2. Clear browser data (F12 → Application → Clear storage)
3. Log back in

### Issue: Backend won't start
**Quick Fix:**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
# Note the PID (last column)
taskkill /PID <PID> /F

# Restart
npm run dev
```

---

## Expected Behavior

### What SHOULD Happen:

1. Navigate to Courses → Advanced Sarf
2. Click on any unit (1-5)
3. Click "Flashcards" button in unit header
4. See list of flashcards for that unit
5. Click "Study Session" or "Review Session"
6. Flashcards appear with flip animation
7. Rate cards (1-5)
8. Progress is tracked

### What Should NOT Happen:

- ❌ "Unable to Load Flashcards" error (if logged in and accessing Unit 1-5)
- ❌ Blank page with no error message
- ❌ Infinite loading spinner
- ❌ 401/403 errors when logged in

---

## Contact Information

If issues persist:
1. Check `FLASHCARD_TEST_RESULTS.md` for complete test documentation
2. Run verification script to confirm database state
3. Check both backend and frontend console logs
4. Provide specific error messages when reporting issues

---

**End of Troubleshooting Guide**
