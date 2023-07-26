import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { rehypeComponents } from "./custom-components.js";
import { visit } from "unist-util-visit";
import fm from "front-matter";

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
    .use(rehypeH1, { level: 1 })
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

    .use(rehypeComponents, {
      components,
    })

    .use(rehypeExternalLinks, { target: "_blank", rel: ["nofollow"] })
    .use(remarkGfm)
    .use(rehypeStringify);

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

function html({ language = "en", content, title = "Document", subline, info }) {
  const html = `<!DOCTYPE html>
    <html lang="${language}">
      <head>
        <meta charset="utf-8" />
        <title>${title.replace("<br>", "")}</title>
        <!-- fonts -->
        <link rel="preconnect" href="https://fonts.signalwerk.ch" />
        <link
          href="https://fonts.signalwerk.ch/css/latest/family=Work+Sans:ital,wght@0,100..900;1,100..900.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.signalwerk.ch/css/latest/family=Open+Sans:ital,wght@0,300..800;1,300..800.css"
          rel="stylesheet"
        />
        <!-- styles -->
        <link
          rel="stylesheet"
          href="https://rawcdn.githack.com/signalwerk/signalwerk.styles/72d62b5/styles/doc.critical.css"
          media="all"
        />
        <link
          rel="preload"
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
          href="https://rawcdn.githack.com/signalwerk/signalwerk.styles/72d62b5/styles/doc.rest.css"
          media="all"
        />

    <style>
    :root {
      --work-sans-fea-aalt: "aalt" off;
      --work-sans-fea-c2sc: "c2sc" off;
      --work-sans-fea-calt: "calt" on;
      --work-sans-fea-case: "case" off;
      --work-sans-fea-dlig: "dlig" off;
      --work-sans-fea-dnom: "dnom" off;
      --work-sans-fea-frac: "frac" off;
      --work-sans-fea-hist: "hist" off;
      --work-sans-fea-liga: "liga" on;
      --work-sans-fea-lnum: "lnum" off;
      --work-sans-fea-locl: "locl" off;
      --work-sans-fea-nalt: "nalt" off;
      --work-sans-fea-numr: "numr" off;
      --work-sans-fea-onum: "onum" on;
      --work-sans-fea-ordn: "ordn" off;
      --work-sans-fea-ornm: "ornm" off;
      --work-sans-fea-pnum: "pnum" on;
      --work-sans-fea-rvrn: "rvrn" off;
      --work-sans-fea-salt: "salt" off;
      --work-sans-fea-sinf: "sinf" off;
      --work-sans-fea-smcp: "smcp" off;
      --work-sans-fea-ss02: "ss02" off;
      --work-sans-fea-ss03: "ss03" off;
      --work-sans-fea-ss04: "ss04" off;
      --work-sans-fea-ss05: "ss05" off;
      --work-sans-fea-subs: "subs" off;
      --work-sans-fea-sups: "sups" off;
      --work-sans-fea-tnum: "tnum" off;
      --work-sans-fea-zero: "zero" off;
      --work-sans-fea-cpsp: "cpsp" off;
      --work-sans-fea-kern: "kern" on;
    }
    :root {
      font-family: Work Sans;
      font-feature-settings: var(--work-sans-fea-aalt), var(--work-sans-fea-c2sc),
      var(--work-sans-fea-calt), var(--work-sans-fea-case), var(
        --work-sans-fea-dlig
      ), var(--work-sans-fea-dnom), var(--work-sans-fea-frac), var(
        --work-sans-fea-hist
      ), var(--work-sans-fea-liga), var(--work-sans-fea-lnum), var(
        --work-sans-fea-locl
      ), var(--work-sans-fea-nalt), var(--work-sans-fea-numr), var(
        --work-sans-fea-onum
      ), var(--work-sans-fea-ordn), var(--work-sans-fea-ornm), var(
        --work-sans-fea-pnum
      ), var(--work-sans-fea-rvrn), var(--work-sans-fea-salt), var(
        --work-sans-fea-sinf
      ), var(--work-sans-fea-smcp), var(--work-sans-fea-ss02), var(
        --work-sans-fea-ss03
      ), var(--work-sans-fea-ss04), var(--work-sans-fea-ss05), var(
        --work-sans-fea-subs
      ), var(--work-sans-fea-sups), var(--work-sans-fea-tnum), var(
        --work-sans-fea-zero
      ), var(--work-sans-fea-cpsp), var(--work-sans-fea-kern);
    }
    h1 {
      letter-spacing: inherit;
      text-transform: none;
    }
    @media print {
      .header {
      padding-top: 0;
    }
  }

    @media print {
      @page {
        size: A4;
        margin: 15mm 15mm 29mm 25mm;
      }
    }
    

    blockquote {
      color: black;
      margin-top: 3rem;
      margin-bottom: 3rem;
    }

    .document {
      margin-bottom: 14rem;
    }

    @media print {
      .document {
        margin-bottom: 0;
      }
  
    }

  </style>
      </head>
      <body class="body">
        <!-- page content -->

        <main>
          <!-- html:children:start -->

          <article class="document">
            <header class="header">
              <div class="header__inner">
                <h1 class="header__title">${title}</h1>
                <p class="header__subline">${subline || ""}</p>
                <p class="header__info">
                  ${info}
                </p>
              </div>
            </header>

            <!-- document:children:start -->

            <div class="document__item">
              <section class="collection">
                <!-- collection:children:start -->

                <div class="markdown">${content}</div>

                <!-- collection:children:end -->
              </section>
            </div>

            <!-- document:children:end -->
          </article>

          <!-- html:children:end -->
        </main>
      </body>
    </html>`;
  return html;
}

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

export function mdToHtml(md, { processor, language = "en" } = {}) {
  const { data, html } = mdToHtmlBody(md, { processor });

  const h1 = html.data.title;
  // const frontmatter = proc.data.matter;

  // console.log("proc", proc);
  // const h1 = getFirstH1(proc);
  const content = html.toString();

  return html({
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
