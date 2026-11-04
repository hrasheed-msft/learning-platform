"""Publish the clips the lessons reference to frontend/public/audio/nuraniyyah.

Reads work/content.json (urls) and work/plan.json (recipes for joined clips).
Single clips are copied from <split dir>/lesson-NN-<slug>/CCC.mp3; joined clips (cd10-grp-NN.mp3) are made by
concatenating the listed clips of a track.
"""
import glob, json, os, re, shutil, subprocess
import imageio_ffmpeg
import export_clips as ex
from align import WORK

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
PUBLIC = os.path.join(REPO, 'frontend', 'public', 'audio', 'nuraniyyah')
FF = imageio_ffmpeg.get_ffmpeg_exe()
TRACK_BY_CD = {num: track for track, (num, _slug) in ex.LESSONS.items()}
SLUG_BY_CD = {num: slug for _track, (num, slug) in ex.LESSONS.items()}


def clip_path(cd, clip_no):
    return os.path.join(ex.DEST, f'lesson-{cd:02d}-{SLUG_BY_CD[cd]}', f'{clip_no:03d}.mp3')


def main():
    content = json.load(open(os.path.join(WORK, 'content.json'), encoding='utf-8'))
    plan = json.load(open(os.path.join(WORK, 'plan.json'), encoding='utf-8'))
    os.makedirs(PUBLIC, exist_ok=True)
    for f in glob.glob(os.path.join(PUBLIC, '*.mp3')):
        os.remove(f)
    copied = joined = 0
    for url in content['urls']:
        name = os.path.basename(url)
        dest = os.path.join(PUBLIC, name)
        m = re.fullmatch(r'cd(\d\d)-(\d{3})\.mp3', name)
        if m:
            shutil.copyfile(clip_path(int(m.group(1)), int(m.group(2))), dest)
            copied += 1
        elif url in plan['recipes']:
            recipe = plan['recipes'][url]
            cd = int(re.match(r'cd(\d\d)-', name).group(1))
            sources = [clip_path(cd, c + 1) for c in recipe['clips']]
            args = [FF, '-v', 'error', '-y']
            for s in sources:
                args += ['-i', s]
            args += ['-filter_complex', f'concat=n={len(sources)}:v=0:a=1', '-ar', '22050', '-ac', '1',
                     '-c:a', 'libmp3lame', '-q:a', '6', dest]
            subprocess.run(args, check=True)
            joined += 1
        else:
            raise SystemExit(f'No source for {url}')
    print(f'published {copied} clips + {joined} joined clips to {PUBLIC}')


if __name__ == '__main__':
    main()
