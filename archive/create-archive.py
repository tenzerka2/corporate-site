#!/usr/bin/env python3
"""Package source, ignored work artifacts and complete Git history outside the repo."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import tempfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_DIRS = {'.git', '.next', 'node_modules', '__pycache__'}


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args], text=True).strip()


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 archive/create-archive.py /absolute/output.tar.gz')
    output = Path(sys.argv[1]).resolve()
    if output.is_relative_to(ROOT):
        raise SystemExit('Archive output must be outside the project.')
    if output.exists():
        raise SystemExit('Output already exists; choose another filename.')
    if git('status', '--porcelain', '--untracked-files=all'):
        raise SystemExit('Commit project changes before creating the checkpoint.')
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='onega-archive-') as temporary:
        stage = Path(temporary) / output.name.removesuffix('.tar.gz')
        project = stage / 'project'
        project.mkdir(parents=True)
        for folder, dirs, files in os.walk(ROOT):
            dirs[:] = sorted(d for d in dirs if d not in EXCLUDED_DIRS)
            for name in sorted(files):
                if name.startswith('.env') or name.endswith(('.tsbuildinfo', '.pyc')):
                    continue
                source = Path(folder) / name
                if source.is_symlink():
                    raise SystemExit(f'Review symlink before archiving: {source}')
                destination = project / source.relative_to(ROOT)
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
        bundle = stage / 'history.bundle'
        git('bundle', 'create', str(bundle), '--all')
        git('bundle', 'verify', str(bundle))
        (stage / 'SNAPSHOT.json').write_text(json.dumps({
            'project': 'onega-logistic',
            'created_at_utc': datetime.now(timezone.utc).isoformat(),
            'head': git('rev-parse', 'HEAD'),
            'branch': git('branch', '--show-current'),
            'commits': git('log', '--all', '--format=%H %aI %s').splitlines(),
            'excluded_directories': sorted(EXCLUDED_DIRS),
            'excluded_files': ['.env*', '*.tsbuildinfo', '*.pyc'],
            'github_upload': 'not confirmed by local packaging',
        }, ensure_ascii=False, indent=2) + '\n')
        entries = sorted(path for path in stage.rglob('*') if path.is_file())
        (stage / 'MANIFEST.sha256').write_text(''.join(
            f'{digest(path)}  {path.relative_to(stage)}\n' for path in entries
        ))
        with tarfile.open(output, 'w:gz') as archive:
            archive.add(stage, arcname=stage.name)
    checksum = output.with_name(output.name + '.sha256')
    checksum.write_text(f'{digest(output)}  {output.name}\n')
    print(json.dumps({'archive': str(output), 'bytes': output.stat().st_size,
                      'sha256_file': str(checksum)}, indent=2))


if __name__ == '__main__':
    main()
