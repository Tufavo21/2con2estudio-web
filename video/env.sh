_hfdir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export HYPERFRAMES_FFMPEG_PATH="$(cygpath -w "$_hfdir/tools/ffmpeg.exe")"
export HYPERFRAMES_FFPROBE_PATH="$(cygpath -w "$_hfdir/tools/ffprobe.exe")"
export HYPERFRAMES_PYTHON="$(cygpath -w "$_hfdir/tools/python/python.exe")"
