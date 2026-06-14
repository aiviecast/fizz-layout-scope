# fizz-layout-scope

Fizz の **横/縦レイアウト scope 解決**(§8 Overlay)。横(16:9)/縦(9:16)で位置設定の
保存スコープを分けるため、mode 指定とクエリから「縦か否か」を決める。

優先順位(openaituber `positionScope.ts` と同一):
1. `mode` が明示されていれば `mode == "vertical"`
2. 無ければ URL クエリ(`?vertical` / `?layout=vertical`)

`window.location` / localStorage キー組み立ては TS、判定ロジックは Almide。scope 文字列
ではなく **Bool/Int(縦か否か)** を返し、ブラウザが `":vertical"` suffix とキーを組む
(文字列を wasm 越しに返さない設計)。

## native

```sh
almide build src/main.almd -o build/fizz-layout-scope
./build/fizz-layout-scope
# {"mode_vertical":1,"mode_landscape":0,"query_vertical":1,"default":0}
```

## wasm

```sh
almide build src/bridge.almd --target wasm -o build/ls.wasm
```

`scope_id(has_mode, mode_vertical, query_vertical) -> Float`(1=縦, 0=横)/ `is_vertical(...)`。
グルー例 [`browser/scope-driver.js`](./browser/scope-driver.js)(location を見て `:vertical`
suffix とスコープ付きキーを組む)。CI で wasm↔native 一致を検証。

ツールチェーン: [almide](https://github.com/almide/almide) v0.27.6+。依存なし。
