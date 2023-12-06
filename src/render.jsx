export function renderNode(node) {
  if (!node) return;

  switch (node.type) {
    case "root":
      return <div>{node.children.map(renderNode)}</div>;

    case "heading":
      const HeadingTag = `h${node.depth}`;
      return <HeadingTag>{node.children.map(renderNode)}</HeadingTag>;

    case "text":
      return <span>{node.value}</span>;

    case "paragraph":
      return <p>{node.children.map(renderNode)}</p>;

    case "link":
      return (
        <a href={node.url} title={node.title} target="_blank" rel="noreferrer">
          {node.children.map(renderNode)}
        </a>
      );

    case "thematicBreak":
      return <hr />;

    case "list":
      const ListTag = node.ordered ? "ol" : "ul";
      return <ListTag>{node.children.map(renderNode)}</ListTag>;

    case "listItem":
      return <li>{node.children.map(renderNode)}</li>;

    default:
      return <div>!!! Unsupported node type: {node.type}</div>;
  }
}
