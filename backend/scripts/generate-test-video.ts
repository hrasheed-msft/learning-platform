/**
 * Local script to generate a test video for quality review.
 * Run with: npx tsx scripts/generate-test-video.ts
 */
import 'dotenv/config';
import { generateUnitVideo } from '../src/services/videoService';
import prisma from '../src/config/database';

const UNIT_ID = '578371a4-8ff3-445c-953b-6937c1ce93c4';
const LANGUAGE = 'en';

async function main() {
  console.log('Starting test video generation...');
  console.log(`Unit: ${UNIT_ID}, Language: ${LANGUAGE}`);
  console.log(`Speech Key: ${process.env.AZURE_SPEECH_KEY ? 'SET' : 'MISSING'}`);
  console.log(`Speech Region: ${process.env.AZURE_SPEECH_REGION || 'MISSING'}`);
  
  try {
    const start = Date.now();
    const videoUrl = await generateUnitVideo(UNIT_ID, LANGUAGE);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\n✓ Video generated in ${elapsed}s`);
    console.log(`  Output: ${videoUrl}`);
    console.log(`  Full path: backend/public/videos/${UNIT_ID}-${LANGUAGE}.mp4`);
  } catch (error: any) {
    console.error('\n✗ Video generation failed:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
