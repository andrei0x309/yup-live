
import { unlinkSync } from "node:fs";
const path = "dist/worker.js";
const file = Bun.file(path);
await Bun.write("dist/_worker.js", file);
unlinkSync(path);