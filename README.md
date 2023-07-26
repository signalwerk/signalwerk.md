# signalwerk.md

Markdown tools used for some projects

```sh
mkdir packages
git submodule add git@github.com:signalwerk/signalwerk.md.git "./packages/signalwerk.md"
```

## Usage

```sh
node packages/signalwerk.md/cli.js ./docs/index.md --language=de
```

## Dependencies

```sh
npm i rehype-raw
npm i rehype-highlight
npm i rehype-sanitize
npm i rehype-external-links
npm i front-matter
npm i buffer
npm i mdast-util-gfm-autolink-literal@^1
npm i mdast-util-gfm-strikethrough@^1
npm i mdast-util-gfm-table@^1
npm i mdast-util-gfm-task-list-item@^1
npm i micromark-extension-gfm-autolink-literal@^1
npm i micromark-extension-gfm-strikethrough@^1
npm i micromark-extension-gfm-table@^1
npm i micromark-extension-gfm-task-list-item@^1
npm i micromark-util-combine-extensions@^1
npm i remark-parse
npm i remark-rehype
npm i rehype-stringify
```
