const AUDIO_FILE_MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED_AUDIO_MIME_TYPES = new Set([
  'audio/aac',
  'audio/flac',
  'audio/m4a',
  'audio/mp3',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/wave',
  'audio/webm',
  'audio/x-m4a',
  'audio/x-wav',
]);

const ALLOWED_AUDIO_EXTENSIONS = new Set([
  '.aac',
  '.flac',
  '.m4a',
  '.mp3',
  '.oga',
  '.ogg',
  '.wav',
  '.webm',
]);

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
]);

type AudioFileLike = Pick<File, 'name' | 'size' | 'type'>;

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validateAudioFile(file: AudioFileLike): ValidationResult {
  if (file.size <= 0) {
    return { valid: false, error: 'Choose an audio file that is not empty.' };
  }

  if (file.size > AUDIO_FILE_MAX_BYTES) {
    return { valid: false, error: 'Audio files must be 25 MB or smaller.' };
  }

  const extension = getFileExtension(file.name);
  const normalizedType = file.type.toLowerCase();
  const hasAllowedType = normalizedType ? ALLOWED_AUDIO_MIME_TYPES.has(normalizedType) : false;
  const hasAllowedExtension = extension ? ALLOWED_AUDIO_EXTENSIONS.has(extension) : false;

  if (!hasAllowedType && !hasAllowedExtension) {
    return { valid: false, error: 'Use a supported audio file: MP3, WAV, M4A, AAC, OGG, FLAC, or WEBM.' };
  }

  return { valid: true };
}

export function normalizeYoutubeUrl(rawUrl: string): string | null {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
    return null;
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(host)) {
    return null;
  }

  const videoId = getYoutubeVideoId(parsedUrl);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
}

function getFileExtension(fileName: string): string | null {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? null;
}

function getYoutubeVideoId(url: URL): string | null {
  if (url.hostname.toLowerCase() === 'youtu.be') {
    return validateYoutubeVideoId(url.pathname.split('/').filter(Boolean)[0]);
  }

  if (url.pathname === '/watch') {
    return validateYoutubeVideoId(url.searchParams.get('v'));
  }

  const pathParts = url.pathname.split('/').filter(Boolean);
  if (['embed', 'shorts', 'live'].includes(pathParts[0])) {
    return validateYoutubeVideoId(pathParts[1]);
  }

  return null;
}

function validateYoutubeVideoId(videoId: string | null | undefined): string | null {
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return null;
  }

  return videoId;
}
