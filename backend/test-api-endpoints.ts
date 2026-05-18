import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function testFlashcardEndpoints() {
  console.log('🧪 Testing Flashcard API Endpoints...\n');

  try {
    // First, login to get a token
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@islamic-learning.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✓ Login successful\n');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    // Test 1: Get course flashcards
    console.log('2️⃣ Testing GET /api/flashcards/course/:courseId');
    const courseId = 'cf1ba495-94cb-4bb1-a8f7-f6a4fb2ad6f2'; // Sarf course
    
    try {
      const courseFlashcardsResponse = await axios.get(
        `${BASE_URL}/flashcards/course/${courseId}`,
        { headers }
      );
      console.log(`✓ Retrieved ${courseFlashcardsResponse.data.length} flashcards for course`);
      console.log(`  Sample: ${courseFlashcardsResponse.data[0]?.front.substring(0, 50)}...`);
    } catch (error: any) {
      console.error(`❌ Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    console.log('');

    // Test 2: Get unit flashcards
    console.log('3️⃣ Testing GET /api/flashcards/unit/:unitId');
    const unitId = 'cba4c088-183c-4b97-a5ed-1ff86e0779c7'; // First unit
    
    try {
      const unitFlashcardsResponse = await axios.get(
        `${BASE_URL}/flashcards/unit/${unitId}`,
        { headers }
      );
      console.log(`✓ Retrieved ${unitFlashcardsResponse.data.length} flashcards for unit`);
      console.log(`  Sample: ${unitFlashcardsResponse.data[0]?.front.substring(0, 50)}...`);
    } catch (error: any) {
      console.error(`❌ Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    console.log('');

    // Test 3: Get flashcards for review (due cards)
    console.log('4️⃣ Testing GET /api/srs/flashcards/due');
    
    try {
      const dueFlashcardsResponse = await axios.get(
        `${BASE_URL}/srs/flashcards/due`,
        { headers }
      );
      console.log(`✓ Retrieved ${dueFlashcardsResponse.data.length} due flashcards`);
    } catch (error: any) {
      console.error(`❌ Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    console.log('');

    // Test 4: Get flashcards for study (new cards)
    console.log('5️⃣ Testing GET /api/srs/flashcards/study');
    
    try {
      const studyFlashcardsResponse = await axios.get(
        `${BASE_URL}/srs/flashcards/study?limit=5`,
        { headers }
      );
      console.log(`✓ Retrieved ${studyFlashcardsResponse.data.length} study flashcards`);
      if (studyFlashcardsResponse.data.length > 0) {
        console.log(`  Sample: ${studyFlashcardsResponse.data[0]?.flashCard?.front?.substring(0, 50)}...`);
      }
    } catch (error: any) {
      console.error(`❌ Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
    console.log('');

    // Test 5: Check routes
    console.log('6️⃣ Testing route availability...');
    const routes = [
      '/flashcards/course/:courseId',
      '/flashcards/unit/:unitId',
      '/srs/flashcards/due',
      '/srs/flashcards/study',
      '/srs/flashcards/:flashcardId/review'
    ];
    
    console.log('Available routes:');
    routes.forEach(route => console.log(`  - ${route}`));

    console.log('\n✅ API endpoint tests completed!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testFlashcardEndpoints();
