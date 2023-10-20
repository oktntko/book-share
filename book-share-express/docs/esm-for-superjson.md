# ESM化対応

## 背景

"superjson": "2.0.0" にするために、ESM化する必要があります

## 試したこと

### @swc-node の ESM化

- `package.json "type":"module",` を追加した
  - `dev`: `node --require @swc-node/register`
    - `Unknown file extension ".ts" for ~/book-share/book-share-express/src/index.ts`
  - `build`: `swc src`
    - `ReferenceError: exports is not defined in ES module scope`
  - swcをESM化していないことが原因
    - `.swcrc`: `"type": "commonjs",` => `"type": "es6",` に変更
    - `tsconfig.json`
      - `"module": "CommonJS"` => `"module": "ES6"` に変更
      - `"resolveJsonModule": true` でエラーになるので、 `"moduleResolution": "node10"` を追加
    - `dev`: `node --loader @swc-node/register/esm` に変更
- 変更を適用した
  - `dev`: `node --loader @swc-node/register/esm`
    - `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/src/app' imported from ~/book-share/book-share-express/src/index.ts`
  - `build`: `swc src`
    - `failed to read .swcrc file for input file at "src/app.ts"`
  - よくわからないので他を試す
    - `tsconfig.json`
      - `"module": "Node16"` に変更
      - `"moduleResolution": "Node16"` を追加
- 変更を適用した
  - `dev`: `node --loader @swc-node/register/esm`
    - `TS2307: Cannot find module '~/xxx/xxx' or its corresponding type declarations.`
    - => '~/xxx/xxx.js' すればいい、けど試していない。
  - `build`: `swc src`
    - `failed to read .swcrc file for input file at "src/app.ts"`
    - => 変わらず

### esbuild を使う

- `esbuild` `esbuild-register` を追加
  - `dev`: `node --require esbuild-register`
    - 問題なし
    - CommonJSのままだけど何で問題ないのか？はわからない
  - `build`: `esbuild src/index.ts --bundle --outdir=dist --platform=node`
    - [Module not found: Error: Can't resolve 'aws-sdk'](https://github.com/kelektiv/node.bcrypt.js/issues/758)
    - 謎のエラーが発生するので、 `bcrypt` => `bcryptjs`
      - 更新されてないけどダウンロード数が多い
- 問題
  - バンドルされるので、ビルドファイルを実行すると、ログに行番号が表示されない。
  - それで swc を選択した気がする
- 良かった
  - ビルドは異常に早い
  - `nodemon`使っているけど不要になるっぽい

### ts-node を使う

- うまくいかないのでパス

結論、esbuildを使うことにした
