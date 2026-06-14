import { readFileSync } from "node:fs";
const mod = await WebAssembly.compile(readFileSync(new URL("../build/ls.wasm", import.meta.url)));
const imports = {}; for (const i of WebAssembly.Module.imports(mod)) (imports[i.module] ??= {})[i.name] = () => 0;
const { exports: ex } = await WebAssembly.instantiate(mod, imports); try { ex._start(); } catch {}
let ok = true; const ck = (g, w, m) => { if (g !== w) { console.error(`FAIL ${m}: ${g}!=${w}`); ok = false; } };
ck(ex.scope_id(1, 1, 0), 1, "mode vertical"); ck(ex.scope_id(1, 0, 1), 0, "mode landscape wins");
ck(ex.scope_id(0, 0, 1), 1, "query vertical"); ck(ex.scope_id(0, 0, 0), 0, "default");
console.log(ok ? "wasm OK — scope resolution matches native" : "FAIL"); if (!ok) process.exit(1);
