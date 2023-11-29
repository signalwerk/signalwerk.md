# signalwerk.md

Markdown tools used for some projects

```sh
mkdir packages
git submodule add git@github.com:signalwerk/signalwerk.md.git "./packages/signalwerk.md"
```

## Usage

```sh
node packages/signalwerk.md/cli.js ./docs/index.md --language=de --title="Title" --subline="Subline" --info="Stefan Huber · info · info"
```

## Dependencies

```sh
npm i unified@^10
npm i rehype-raw@^6
npm i rehype-highlight@^5
npm i rehype-sanitize@^5
npm i rehype-external-links@^1
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
npm i remark-parse@^10
npm i remark-rehype@^10
npm i rehype-stringify@^9
```
