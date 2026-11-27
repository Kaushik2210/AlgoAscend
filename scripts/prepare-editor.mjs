import { cp, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const source = join(dirname(require.resolve("monaco-editor")), "..", "..");
await mkdir("public/monaco", { recursive: true });
for (const name of ["LICENSE", "ThirdPartyNotices.txt"]) await cp(join(source,name),join("public/monaco",name));
await cp(join(source,"min/vs"),"public/monaco/vs",{recursive:true});
