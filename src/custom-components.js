import { visit, SKIP } from "unist-util-visit";

export function rehypeComponents(options) {
  const { components = {} } = options;
  const processor = this;
  return (tree, vfile) => {
    const context = { tree, vfile, processor };
    visit(tree, (node, index, parent) => {
      const component = components[node.tagName]?.processor?.html;
      if (component) {
        const replacedNode = component(node.properties, node.children, context);
        parent.children[index] = replacedNode;

        // This return value makes sure that the traversal continues by
        // visiting the children of the replaced node (if any)
        return [SKIP, index];
      }
    });
  };
}
