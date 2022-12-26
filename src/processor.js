import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { rehypeComponents } from "./custom-components.js";

// process pictures https://github.com/rehypejs/rehype-picture

import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import rehypeExternalLinks from "rehype-external-links";
import { remarkGfm } from "./gfm.js";

export const mdProcessor = ({ components } = {}) => {
  const componentTags = Object.keys(components || {});

  const componentAttributes = {};

  for (const [key, value] of Object.entries(components || {})) {
    componentAttributes[key] = Object.keys(value.props || {});
  }

  // console.log({ componentTags, componentAttributes });

  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { subset: false })

    .use(rehypeSanitize, {
      ...defaultSchema,

      // allow style tags for special tag handling
      tagNames: [
        ...defaultSchema.tagNames,
        ...componentTags,
        "audio",
        "footer",
        "style",
        "iframe",
      ],

      // allow classNames on code, div and span
      attributes: {
        ...defaultSchema.attributes,
        ...componentAttributes,
        code: [...(defaultSchema.attributes.code || []), "className"],
        div: [...(defaultSchema.attributes.div || []), "className"],
        span: [...(defaultSchema.attributes.span || []), "className"],
        footer: [...(defaultSchema.attributes.footer || []), "className"],
        iframe: [
          ...(defaultSchema.attributes.iframe || []),
          "className",
          "src",
          "width",
          "height",
        ],
        audio: [
          ...(defaultSchema.attributes.audio || []),
          "className",
          "controls",
          "src",
        ],
      },
    })

    .use(rehypeComponents, {
      components,
    })

    .use(rehypeExternalLinks, { target: "_blank", rel: ["nofollow"] })
    .use(remarkGfm)
    .use(rehypeStringify);

  return processor;
};

export function mdToHtml(md, { processor } = {}) {
  if (!processor) {
    return mdProcessor().processSync(md).toString();
  } else {
    return processor.processSync(md).toString();
  }
  // console.log("processing", md);
  // return processor.process(md);

  //   return { /* data: file.data.frontmatter, */ html: String(file) };
}
