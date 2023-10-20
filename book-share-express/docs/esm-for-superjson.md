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
