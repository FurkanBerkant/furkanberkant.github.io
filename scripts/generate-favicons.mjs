import {spawnSync} from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const publicDirectory = path.join(projectRoot, "public");
const brandMark = path.join(publicDirectory, "brand-mark.svg");
const temporaryDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "berkant-favicon-")
);
const sourcePng = path.join(temporaryDirectory, "source.png");

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

try {
  run("/usr/bin/sips", [
    "-s",
    "format",
    "png",
    brandMark,
    "--out",
    sourcePng
  ]);

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
