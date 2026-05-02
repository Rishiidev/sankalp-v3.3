import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const ROOT = new URL('../public/', import.meta.url);

mkdirSync(new URL('screenshots/', ROOT), { recursive: true });

writePng(new URL('icon-192.png', ROOT), 192, 192, pixelForIcon);
writePng(new URL('icon-512.png', ROOT), 512, 512, pixelForIcon);
writePng(new URL('maskable-icon-512.png', ROOT), 512, 512, pixelForMaskableIcon);
writePng(new URL('screenshots/mobile.png', ROOT), 540, 960, pixelForMobileScreenshot);
writePng(new URL('screenshots/wide.png', ROOT), 1280, 720, pixelForWideScreenshot);

function writePng(path, width, height, pixelFor) {
  const scanlines = Buffer.alloc((width * 4 + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (width * 4 + 1);
    scanlines[rowOffset] = 0;

    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixelFor(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      scanlines[pixelOffset] = r;
      scanlines[pixelOffset + 1] = g;
      scanlines[pixelOffset + 2] = b;
      scanlines[pixelOffset + 3] = a;
    }
  }

  const png = Buffer.concat([
    pngSignature(),
    chunk('IHDR', ihdr(width, height)),
    chunk('IDAT', deflateSync(scanlines)),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  writeFileSync(path, png);
}

function pixelForIcon(x, y, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = Math.abs(x - cx) / width;
  const dy = Math.abs(y - cy) / height;
  const flame = dy < 0.32 && dx < 0.12 + dy * 0.52 && y > height * 0.18 && y < height * 0.78;

  if (flame) {
    return [249, 115, 22, 255];
  }

  return [15, 23, 42, 255];
}

function pixelForMaskableIcon(x, y, width, height) {
  const [r, g, b] = pixelForIcon(x, y, width, height);
  const safeArea = x > width * 0.1 && x < width * 0.9 && y > height * 0.1 && y < height * 0.9;

  if (safeArea) {
    return [r, g, b, 255];
  }

  return [15, 23, 42, 255];
}

function pixelForMobileScreenshot(x, y, width, height) {
  return screenshotPixel(x, y, width, height, 0.62);
}

function pixelForWideScreenshot(x, y, width, height) {
  return screenshotPixel(x, y, width, height, 0.5);
}

function screenshotPixel(x, y, width, height, centerScale) {
  const base = [2, 6, 23, 255];
  const panel = x > width * 0.12 && x < width * 0.88 && y > height * 0.12 && y < height * 0.88;
  const centerX = width * 0.5;
  const centerY = height * 0.38;
  const radius = Math.min(width, height) * centerScale * 0.22;
  const distance = Math.hypot(x - centerX, y - centerY);

  if (distance < radius) {
    return [249, 115, 22, 255];
  }

  if (panel) {
    return [15, 23, 42, 255];
  }

  return base;
}

function pngSignature() {
  return Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
}

function ihdr(width, height) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8;
  data[9] = 6;
  data[10] = 0;
  data[11] = 0;
  data[12] = 0;
  return data;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);

  const crcInput = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput));

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
