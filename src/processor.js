import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import fm from "front-matter";

// process pictures https://github.com/rehypejs/rehype-picture

import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import rehypeExternalLinks from "rehype-external-links";
import { remarkGfm } from "./gfm.js";

export const astProcessor = () => {
  const processor = unified()
    .use(remarkParse)
    .use(rehypeH1, { level: 1 })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { subset: false })

    .use(rehypeSanitize, {
      ...defaultSchema,

      // allow style tags for special tag handling
      tagNames: [
        ...defaultSchema.tagNames,
        "audio",
        "footer",
        "style",
        "iframe",
      ],

      // allow classNames on code, div and span
      attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes.code || []), "className"],
        div: [...(defaultSchema.attributes.div || []), "className", "style"],
        span: [...(defaultSchema.attributes.span || []), "className", "style"],
        footer: [...(defaultSchema.attributes.footer || []), "className"],
        iframe: [
          ...(defaultSchema.attributes.iframe || []),
          "className",
          "src",
          "width",
          "height",
          "style",
        ],
        audio: [
          ...(defaultSchema.attributes.audio || []),
          "className",
          "controls",
          "src",
        ],
      },
    })

    .use(rehypeExternalLinks, { target: "_blank", rel: ["nofollow"] })
    .use(remarkGfm);
  // .use(rehypeStringify);

  return processor;
};
export const htmlProcessor = () => {
  const processor = astProcessor().use(rehypeStringify);

  return processor;
};

// function getFirstH1(node) {
//   let h1 = null;
//   visit(node, "heading", (node) => {
//     if (node.depth === 1) {
//       h1 = node;
//       return false; // Stop visiting nodes
//     }
//   });
//   return h1;
// }

export function rehypeH1(options) {
  const { level = 1 } = options;
  const processor = this;
  return (tree, vfile) => {
    firstH1(tree, vfile);
  };
}

// .use(() => (tree) => {
//   console.dir(tree)
// })

// const firstH1Processor = function (options = {}) {
//   return function (processor) {
//     const { Parser } = processor;
//     Parser.prototype.parse = function () {
//       const ast = remarkParse.apply(this, arguments);
//       const h1 = firstH1()(ast);
//       return h1;
//     };
//   };
// };

const firstH1 = (tree, file) => {
  let h1;

  visit(tree, "heading", (node) => {
    if (node.depth === 1) {
      h1 = node;
      return false; // Stop visiting nodes
    }
  });

  if (h1) {
    const h1Text = h1.children[0].value;
    file.data.title = h1Text;
  }
  return h1;
};

export function mdToHtmlBody(md, { processor } = {}) {
  let proc = null;

  // try {
  const frontmatter = fm(md);

  const fmHeader = frontmatter.attributes;
  const fmBody = frontmatter.body;

  if (!processor) {
    proc = mdProcessor().processSync(fmBody);
  } else {
    proc = processor.processSync(fmBody);
  }

  return { data: fmHeader, html: proc };
}

/**
 * Extract frontmatter from markdown content
 * @param {string} md - Markdown content with optional frontmatter
 * @returns {Object} - Object with frontmatter attributes and body content
 */
export function extractFrontmatter(md) {
  const frontmatter = fm(md);
  return {
    attributes: frontmatter.attributes,
    body: frontmatter.body
  };
}

export function mdToHtml(md, { processor, language = "en" } = {}) {
  const { data, html } = mdToHtmlBody(md, { processor });
  const h1 = html.data.title;
  // const frontmatter = proc.data.matter;

  // console.log("proc", proc);
  // const h1 = getFirstH1(proc);
  const content = html.toString();

  return generateHtml({
    language,
    content,
    title: data.title || h1,
    subline: data.subline,
    info: data.info,
  });
  // console.log("processing", md);
  // return processor.process(md);

  //   return { /* data: file.data.frontmatter, */ html: String(file) };
}
