"""Export every silence-separated clip of the Nuraniyyah lesson MP3s as its own MP3.

Reads work/<NNN>.json (produced by transcribe_all.py) and writes
  <DEST>/lesson-NN-<slug>/<NNN>.mp3   (mono, 22.05 kHz, 10 ms fades, 120 ms padding)
  <DEST>/manifest.json                (lesson -> clip index, times, Whisper label)
"""
import json, os, subprocess, sys, tempfile
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
SRC = os.environ.get('NURANIYYAH_MP3_DIR', r'C:\Users\hrasheed\Dropbox\Nuraniyyah-MP3')
DEST = os.environ.get('NURANIYYAH_SPLIT_DIR', os.path.join(SRC, 'split'))
WORK = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'work')
PAD = 0.12

# CD track -> (CD lesson number, slug). Track 001 and 012 are the opening du'a, not lessons.
LESSONS = {
    '002': (1, 'single-letters'), '003': (2, 'combined-letters'), '004': (3, 'disjointed-letters'),
    '005': (4, 'vowels-harakat'), '006': (5, 'tanween'), '007': (6, 'exercises-harakat-tanween'),
    '008': (7, 'small-alif-yaa-waw'), '009': (8, 'madd-and-leen'), '010': (9, 'exercises-tanween-madd'),
    '011': (10, 'sukoon'), '013': (11, 'exercises-sukoon'), '014': (12, 'shaddah'),
    '015': (13, 'exercises-shaddah'), '016': (14, 'exercises-shaddah-sukoon'),
    '017': (15, 'exercises-two-shaddahs'), '018': (16, 'exercises-shaddah-sukoon-madd'),
}


def source_for(track):
    return next(os.path.join(SRC, f) for f in os.listdir(SRC) if f.startswith(track + '-') and f.endswith('.mp3'))


def main():
    only = set(sys.argv[1:])
    os.makedirs(DEST, exist_ok=True)
    manifest_path = os.path.join(DEST, 'manifest.json')
    manifest = json.load(open(manifest_path, encoding='utf-8')) if os.path.exists(manifest_path) else {}
    for track, (num, slug) in LESSONS.items():
        if only and track not in only:
            continue
        rows = json.load(open(os.path.join(WORK, track + '.json'), encoding='utf-8'))
        folder = f'lesson-{num:02d}-{slug}'
        out_dir = os.path.join(DEST, folder)
        os.makedirs(out_dir, exist_ok=True)
        with tempfile.TemporaryDirectory() as tmp:
            wav = os.path.join(tmp, 'full.wav')
            subprocess.run([FF, '-v', 'error', '-y', '-i', source_for(track), '-ac', '1', '-ar', '44100', wav], check=True)
            clips = []
            for r in rows:
                start, end = max(0.0, r['start'] - PAD), r['end'] + PAD
                dur = end - start
                name = f"{r['i'] + 1:03d}.mp3"
                fade = f'afade=t=in:d=0.01,afade=t=out:st={max(0.0, dur - 0.02):.3f}:d=0.02'
                subprocess.run([FF, '-v', 'error', '-y', '-ss', f'{start:.3f}', '-t', f'{dur:.3f}', '-i', wav, '-af', fade,
                                '-ar', '22050', '-ac', '1', '-c:a', 'libmp3lame', '-q:a', '6', os.path.join(out_dir, name)], check=True)
                clips.append({'clip': name, 'start': r['start'], 'end': r['end'], 'duration': r['dur'], 'label': r['text']})
        manifest[folder] = {'cdLesson': num, 'sourceTrack': track, 'sourceFile': os.path.basename(source_for(track)), 'clips': clips}
        print(folder, len(clips), flush=True)
    with open(manifest_path, 'w', encoding='utf-8') as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
