import assert from 'node:assert/strict';
import { normalizeYoutubeUrl, validateAudioFile } from './validation';

describe('validateAudioFile', () => {
  it('accepts supported audio files within the size limit', () => {
    assert.deepEqual(
      validateAudioFile({ name: 'chant.mp3', size: 1024, type: 'audio/mpeg' } as File),
      { valid: true },
    );
  });

  it('rejects empty files', () => {
    assert.equal(
      validateAudioFile({ name: 'empty.mp3', size: 0, type: 'audio/mpeg' } as File).valid,
      false,
    );
  });

  it('rejects oversized files', () => {
    const result = validateAudioFile({ name: 'huge.mp3', size: 26 * 1024 * 1024, type: 'audio/mpeg' } as File);

    assert.equal(result.valid, false);
  });

  it('rejects files without supported audio type or extension', () => {
    const result = validateAudioFile({ name: 'notes.txt', size: 1024, type: 'text/plain' } as File);

    assert.equal(result.valid, false);
  });
});

describe('normalizeYoutubeUrl', () => {
  it('normalizes standard YouTube watch URLs', () => {
    assert.equal(
      normalizeYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&feature=share'),
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );
  });

  it('normalizes youtu.be URLs', () => {
    assert.equal(
      normalizeYoutubeUrl('https://youtu.be/dQw4w9WgXcQ'),
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );
  });

  it('normalizes shorts URLs', () => {
    assert.equal(
      normalizeYoutubeUrl('https://youtube.com/shorts/dQw4w9WgXcQ'),
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    );
  });

  it('rejects non-YouTube URLs', () => {
    assert.equal(normalizeYoutubeUrl('https://example.com/video'), null);
  });

  it('rejects JavaScript URLs', () => {
    assert.equal(normalizeYoutubeUrl('javascript:alert(1)'), null);
  });
});
