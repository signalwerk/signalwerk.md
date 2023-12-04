import { htmlProcessor, astProcessor } from "./processor.js";

export const mdToHtmlSync = (md) => {
  const html = htmlProcessor().processSync(md);
  return { html };
};

export const mdToAstSync = (md) => {
  const ast = astProcessor().parse(md);
  return { ast };
};
