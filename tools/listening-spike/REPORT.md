# Listening mode spike — report

Question: can the app listen to a child say a letter cell and tell **a wrong letter** from **a wrong vowel (diacritic)**,
on the device (iPad first), without a cloud service?

**Short answer.** Vowels: yes, reliably. Letters: good in a quiet room, noticeably weaker in noise, and the remaining
mistakes are mostly the letter pairs that are acoustically close (ث/ذ, ت/ط, ر). A cloud service is not needed to start.
All numbers below come from **simulated** children (the CD teacher's voice shifted, slowed, on another microphone, with
room noise) because there are no real child recordings yet, so treat them as optimistic until the lab has been used with
real children.

## What was built

| Piece | Where |
|---|---|
| Test set: 30 single syllables (10 letters × a/i/u) cut from CD track 011 | `dataset.py` |
| Simulated other voices (formant shift, tempo, microphone EQ, noise) | `augment.py` |
| Scorers: MFCC + DTW, MFCC + DTW with vocal-tract warping (VTLN), Whisper-encoder + DTW | `features.py`, `evaluate.py`, `neural.py` |
| TypeScript port of the winning scorer (runs in the browser, checked against Python) | `frontend/src/lib/listening/` |
| Listening lab page for real devices: `/listening-lab` (not linked from the app) | `frontend/src/pages/listening/ListeningLab.tsx` |
| Full-browser check with a fake microphone (Chromium + opus + resampling) | `make_fake_mic_cases.py`, `browser_check.mjs` |

Run the evaluation (Python, from this folder): `python dataset.py`, then `python evaluate.py mfcc mfcc-vtln whisper-small`.

## Results (30 syllables, closest-clip decision among all 30)

Top-1 = the query's own syllable (letter and vowel) was the closest of the 30 teacher clips. Chance is 3 %.

| Voice (simulated) | MFCC + DTW | **MFCC + DTW + VTLN** | its letter / vowel part | Whisper-small encoder |
|---|---|---|---|---|
| same voice, slower, clean | 100 % | 100 % | 100 / 100 | 100 % |
| same voice, other microphone, 20 dB | 100 % | 100 % | 100 / 100 | 90 % |
| adult woman (×1.3), 20 dB | 10 % | **97 %** | 97 / 100 | 73 % |
| child (×1.45), 20 dB | 3 % | **90 %** | 90 / 100 | 40 % |
| child (×1.45), 10 dB noisy room | 7 % | **60 %** | 60 / 90 | 30 % |
| young child (×1.65), 15 dB | 0 % | **67 %** | 67 / 97 | 30 % |
| very young child (×1.85), 15 dB | 0 % | **60 %** | 60 / 100 | 30 % |

* Plain MFCC fails as soon as the voice changes. **Vocal-tract warping** (trying 11 warp factors on the recording and
  keeping the best) is what makes it work, and it is cheap on a device.
* The Whisper encoder (zero-shot, DTW on its frames) is worse than MFCC+VTLN and far heavier, so it is not worth pursuing
  unless a phoneme-trained model is used.
* **Vowel mistakes** are detected almost perfectly (AUC 1.00 in every child condition, 0 vowel errors accepted).
* Spectral subtraction against the background noise was tried (`experiment_denoise.py`) and changed little (0–7 points).
* Letter errors are dominated by ث↔ذ, then ت/ظ/ش/ر mix-ups in noise. These are the "close pronunciation" letters the
  first version is allowed to overlook; `LENIENT_LETTER_GROUPS` in `score.ts` already treats ق/ك, ع/ء/أ and ح/ه as equal.

### Accept / reject trade-off (the "forgiveness" setting)

The app accepts the cell when its distance is within `tolerance` of the closest teacher clip. Percent of attempts:

| Voice | tolerance | right answer rejected | wrong vowel accepted | wrong letter accepted |
|---|---|---|---|---|
| child ×1.45, 20 dB | 0 % | 10 | 0 | 1 |
| | **6 %** | 3 | 0 | 3 |
| | 15 % | 0 | 5 | 15 |
| child ×1.45, 10 dB | 0 % | 40 | 0 | 3 |
| | **6 %** | 23 | 0 | 10 |
| | 15 % | 3 | 15 | 33 |
| young child ×1.65, 15 dB | **6 %** | 23 | 0 | 10 |

Default is 6 %: it never lets a wrong vowel through in these tests while keeping false rejections tolerable. For young
children it is better to err towards forgiveness, so the lab exposes the setting.

### End-to-end in a real browser (Chromium, fake microphone, opus codec, 48 kHz → 16 kHz)

24 recordings of simulated children (×1.45, 20 dB): the right syllable was **accepted 10/12**; a wrong vowel was
reported as "right letter, check the vowel" **9/12**, and **0/12** wrong vowels were accepted. The misses were all on
the letter ر (a very short tap consonant). iPad Safari itself has **not** been tested yet.

## Limits and risks

* **Real children are not the simulation.** A real child also has different articulation, longer vowels, hesitations and
  speaks closer to the microphone. Expect lower numbers until thresholds are calibrated on real, consented recordings.
* Noise handling is the weak point: at 10 dB SNR a quarter of correct answers are rejected. Separating non-speech noise
  from speech is also tight (speech best-distance 0.30–0.45; hum/noise 0.47–0.54), so the app also relies on an energy
  voice-activity check before scoring.
* Isolated syllables (أَتْ) were tested. A full card (three vowels in a row), connected letters and whole words still
  need segmentation of the child's recording into syllables.
* Letters with the same articulation point (ق/ك, ع/ء, ح/ه) are accepted for each other in v1 by design; ث/ذ and the
  emphatic pairs (ص/س, ط/ت, ض/د, ظ/ذ) are also confusable and are not yet merged.
* The test references come from one teacher (an adult male voice).

## Decisions this supports

1. **On-device is enough to start.** A cloud service is not needed for the letter/vowel feedback the app needs first.
   Cost, latency and privacy of cloud speech services only become relevant if a phoneme-level model is added later.
2. Use **MFCC + VTLN + DTW** now; wrong-vowel feedback is dependable, wrong-letter feedback should be worded softly
   ("that sounded like ث — listen again") and never block progress.
3. Make listening mode **opt-in and off by default**, parent-controlled, with nothing recorded or stored.

## Next steps

1. Have someone try `/listening-lab` on an iPad (and with a child): tap **Show details → Copy attempts** and send the JSON
   (it contains verdicts and distances only, no audio). That gives the first real numbers.
2. If real data confirms the picture: record a small consented set of children saying the 30 syllables and tune
   `maxDistance`, `tolerance` and the warp grid per age group.
3. Extend to cards: split a card's three vowels (silence / energy dips), score each slot, and add per-lesson reference
   sets (lesson 4 letters, lesson 5 tanwīn, madd) from the CD clips.
4. Only then consider a small phoneme model (on-device ONNX) or a cloud service for the hard pairs.
