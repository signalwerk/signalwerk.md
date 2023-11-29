import { mdProcessor } from "./processor.js";

export const mdToHtmlSync = (md) => {
  const html = mdProcessor().processSync(md);
  return { html };
};
