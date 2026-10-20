"""Preserve the reverse/forward intro with bounded-memory two-second reversals."""
from pathlib import Path
import json
import subprocess

root = Path(__file__).resolve().parents[1]
work = root / '_versions' / 'quality-loop-work'
work.mkdir(exist_ok=True)
ffmpeg = r'C:\Users\ff\scoop\apps\ffmpeg\current\bin\ffmpeg.exe'
ffprobe = str(Path(ffmpeg).with_name('ffprobe.exe'))
results = []
for quality, source, crf, level in [
    ('uhd', 'video2_UHD_4K_LIGERO_AV1.mp4', '26', '5.1'),
    ('mobile', 'video2_FULLHD_WEB_LIGERO.mp4', '21', '4.1'),
]:
    original = root.parent / 'video2_mejorado' / source
    parts = []
    for number, start in enumerate(range(18, -1, -2)):
        part = work / f'{quality}-{number:02}.mp4'
        encoder = (['-c:v', 'libsvtav1', '-preset', '10', '-crf', crf,
                    '-svtav1-params', 'lp=4:tune=0', '-pix_fmt', 'yuv420p10le'] if quality == 'uhd' else
                   ['-c:v', 'libx264', '-preset', 'fast', '-crf', crf, '-profile:v', 'high',
                    '-level:v', level, '-pix_fmt', 'yuv420p'])
        with (work / f'{quality}.log').open('a') as log:
            subprocess.run([ffmpeg, '-v', 'warning', '-y', '-ss', str(start), '-i', str(original),
                '-t', '2', '-an', '-vf', 'reverse,setpts=N/(24*TB),setsar=1',
                *encoder, '-g', '48',
                '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                str(part)], check=True, stdout=log, stderr=log)
        parts.append(part)
        print(f'{quality}: reverse {number+1}/10', flush=True)
    listing = work / f'{quality}-concat.txt'
    listing.write_text(''.join(f"file '{p.as_posix()}'\n" for p in parts + [original]), encoding='utf-8')
    output = root / 'public' / 'media' / f'discovery-quality-{quality}.mp4'
    subprocess.run([ffmpeg, '-v', 'warning', '-y', '-f', 'concat', '-safe', '0', '-i', str(listing),
        '-map', '0:v:0', '-an', '-c:v', 'copy', '-movflags', '+faststart', str(output)], check=True)
    probe = json.loads(subprocess.check_output([ffprobe, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(output)]))
    v = probe['streams'][0]
    assert int(v['nb_frames']) == 960 and abs(float(v['duration']) - 40) < .01
    subprocess.run([ffmpeg, '-v', 'error', '-xerror', '-i', str(output), '-f', 'null', '-'], check=True)
    results.append(dict(file=output.name, width=v['width'], height=v['height'], frames=v['nb_frames'],
                        duration=v['duration'], bytes=output.stat().st_size, decode_ok=True))
    print(json.dumps(results[-1]), flush=True)
(work / 'validation.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
