import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { extname, join, normalize } from "node:path";

const host = "127.0.0.1";
const port = 5173;
const root = fileURLToPath(new URL(".", import.meta.url));

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
    const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = join(root, safePath === "/" ? "index.html" : safePath);
    const content = await readFile(filePath);
    response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "text/plain; charset=utf-8" });
    response.end(request.method === "HEAD" ? "" : content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("找不到页面");
  }
}).listen(port, host, () => {
  console.log(`爸妈生活助手已启动：http://localhost:${port}`);
});
