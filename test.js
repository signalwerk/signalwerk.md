import fs from "fs";
import { mdToHtml, mdProcessor } from "./src/index.js";
import { h } from "hastscript";

const DocumentationPage = (properties, children) =>
  h("div.documentation", { "data-component": "a" }, [
    h("h1", properties.src),
    h(".slot", { "data-children": "a" }, [...children]),
  ]);

const processor = mdProcessor({
  components: {
    "custom-block": {
      props: {
        src: "custom",
      },
      processor: {
        html: DocumentationPage,
      },
    },
  },
});

const md = fs.readFileSync("README.md", "utf8");

const html = mdToHtml(md, { processor });
fs.writeFileSync("test.html", html);
