// scope-driver.js — positionScope のグルー例。判定=Almide(wasm)、location/key 組立=JS。
export async function loadLayoutScope(wasmUrl) {
  const bytes = await (await fetch(wasmUrl)).arrayBuffer();
  const mod = await WebAssembly.compile(bytes);
  const imports = {}; for (const i of WebAssembly.Module.imports(mod)) (imports[i.module] ??= {})[i.name] = () => 0;
  const { exports: ex } = await WebAssembly.instantiate(mod, imports); try { ex._start(); } catch {}
  return {
    // positionScope(mode) 相当: ":vertical" or ""
    suffix(mode) {
      const hasMode = mode != null && mode !== "";
      let queryVertical = false;
      if (typeof window !== "undefined") {
        const q = new URLSearchParams(window.location.search);
        queryVertical = q.has("vertical") || q.get("layout") === "vertical";
      }
      const v = ex.scope_id(hasMode ? 1 : 0, mode === "vertical" ? 1 : 0, queryVertical ? 1 : 0);
      return v === 1 ? ":vertical" : "";
    },
    // スコープ付きキー: base + suffix
    scopedKey(base, mode) { return base + this.suffix(mode); },
  };
}
