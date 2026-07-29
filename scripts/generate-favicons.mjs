import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import pngjs from "pngjs";

const {PNG} = pngjs;

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const publicDirectory = path.join(projectRoot, "public");
const temporaryDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "berkant-favicon-")
);
const sourcePng = path.join(temporaryDirectory, "source.png");

const colors = {
  ink: [10, 11, 12, 255],
  line: [44, 47, 49, 255],
  signal: [200, 255, 90, 255],
  cyan: [126, 231, 214, 255],
  orange: [255, 154, 92, 255],
  transparent: [0, 0, 0, 0]
};

const run = (command, arguments_) => {
  const result = spawnSync(command, arguments_, {stdio: "inherit"});

  if (result.status !== 0) {
    throw new Error(`${command} failed with exit code ${result.status}`);
  }
};

const createIco = images => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(images.length * 16);
  let offset = header.length + directory.length;

  images.forEach(({size, buffer}, index) => {
    const entryOffset = index * 16;
    directory.writeUInt8(size, entryOffset);
    directory.writeUInt8(size, entryOffset + 1);
    directory.writeUInt8(0, entryOffset + 2);
    directory.writeUInt8(0, entryOffset + 3);
    directory.writeUInt16LE(1, entryOffset + 4);
    directory.writeUInt16LE(32, entryOffset + 6);
    directory.writeUInt32LE(buffer.length, entryOffset + 8);
    directory.writeUInt32LE(offset, entryOffset + 12);
    offset += buffer.length;
  });

  return Buffer.concat([
    header,
    directory,
    ...images.map(image => image.buffer)
  ]);
};

const roundedRectangleDistance = (x, y, left, top, width, height, radius) => {
  const horizontal = Math.abs(x - (left + width / 2)) - (width / 2 - radius);
  const vertical = Math.abs(y - (top + height / 2)) - (height / 2 - radius);

  return (
    Math.hypot(Math.max(horizontal, 0), Math.max(vertical, 0)) +
    Math.min(Math.max(horizontal, vertical), 0) -
    radius
  );
};

const segmentDistance = (x, y, startX, startY, endX, endY) => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;
  const projection = Math.max(
    0,
    Math.min(1, ((x - startX) * deltaX + (y - startY) * deltaY) / lengthSquared)
  );

  return Math.hypot(
    x - (startX + projection * deltaX),
    y - (startY + projection * deltaY)
  );
};

const createSourcePng = () => {
  const size = 1024;
  const scale = size / 512;
  const png = new PNG({width: size, height: size});
  const route = [
    [112, 158],
    [214, 158],
    [272, 216],
    [272, 296],
    [330, 354],
    [400, 354]
  ];
  const nodes = [
    {x: 112, y: 158, radius: 38, color: colors.cyan},
    {x: 272, y: 256, radius: 46, color: colors.signal},
    {x: 400, y: 354, radius: 38, color: colors.orange}
  ];

  for (let pixelY = 0; pixelY < size; pixelY += 1) {
    for (let pixelX = 0; pixelX < size; pixelX += 1) {
      const x = (pixelX + 0.5) / scale;
      const y = (pixelY + 0.5) / scale;
      let color = colors.transparent;

      if (roundedRectangleDistance(x, y, 0, 0, 512, 512, 112) <= 0) {
        color = colors.ink;
      }

      const borderOuter = roundedRectangleDistance(x, y, 22, 22, 468, 468, 90);
      const borderInner = roundedRectangleDistance(x, y, 36, 36, 440, 440, 76);

      if (borderOuter <= 0 && borderInner > 0) {
        color = colors.line;
      }

      if (
        route.some((point, index) => {
          if (index === route.length - 1) {
            return false;
          }

          const nextPoint = route[index + 1];
          return (
            segmentDistance(
              x,
              y,
              point[0],
              point[1],
              nextPoint[0],
              nextPoint[1]
            ) <= 15
          );
        })
      ) {
        color = colors.signal;
      }

      const node = nodes.find(
        item => Math.hypot(x - item.x, y - item.y) <= item.radius
      );
      if (node) {
        color = node.color;
      }

      const offset = (pixelY * size + pixelX) * 4;
      png.data[offset] = color[0];
      png.data[offset + 1] = color[1];
      png.data[offset + 2] = color[2];
      png.data[offset + 3] = color[3];
    }
  }

  fs.writeFileSync(sourcePng, PNG.sync.write(png));
};

try {
  createSourcePng();

  const outputs = [
    [16, "favicon-16x16.png"],
    [32, "favicon-32x32.png"],
    [150, "mstile-150x150.png"],
    [180, "apple-touch-icon.png"],
    [192, "android-chrome-192x192.png"],
    [384, "android-chrome-384x384.png"],
    [512, "android-chrome-512x512.png"]
  ];

  outputs.forEach(([size, filename]) => {
    run("/usr/bin/sips", [
      "-z",
      String(size),
      String(size),
      sourcePng,
      "--out",
      path.join(publicDirectory, filename)
    ]);
  });

  const icoImages = [16, 32, 48].map(size => {
    const filename = path.join(temporaryDirectory, `favicon-${size}.png`);
    run("/usr/bin/sips", [
      "-z",
      String(size),
      String(size),
      sourcePng,
      "--out",
      filename
    ]);

    return {size, buffer: fs.readFileSync(filename)};
  });

  fs.writeFileSync(
    path.join(publicDirectory, "favicon.ico"),
    createIco(icoImages)
  );
} finally {
  fs.rmSync(temporaryDirectory, {recursive: true, force: true});
}
