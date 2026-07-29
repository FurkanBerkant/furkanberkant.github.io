import {cp, mkdir, rm, writeFile} from "node:fs/promises";
import {resolve} from "node:path";

const root = process.cwd();
const source = resolve(root, "build");
const output = resolve(root, "dist");
const client = resolve(output, "client");
const server = resolve(output, "server");

await rm(output, {recursive: true, force: true});
await mkdir(server, {recursive: true});
await cp(source, client, {recursive: true});

const worker = `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (request.method !== "GET" || response.status !== 404) {
      return response;
    }

    const fallbackUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};

export default worker;
`;

await writeFile(resolve(server, "index.js"), worker, "utf8");
