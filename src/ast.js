// https://chat.openai.com/c/f6ec58bd-67c8-415a-8382-631b80ada33e
export function astToText(node) {
  let text = [];

  if (node.type === "text") {
    text.push(node.value);
  }

  if (node.children) {
    text.push(node.children.map(astToText).join(" "));
  }

  return text.join(" ");
}
