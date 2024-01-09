// node as mdast
export function renderNode(node, configuration) {
  if (!node) return;

  const { tableIndex, parent } = configuration || {};

  // if node is an array, process each item
  if (Array.isArray(node)) {
    return node.map((item) => renderNode(item, configuration));
  }

  switch (node.type) {
    case "root":
      return <div className="text">{node.children.map(renderNode)}</div>;

    case "heading":
      const HeadingTag = `h${node.depth}`;
      return <HeadingTag>{node.children.map(renderNode)}</HeadingTag>;

    case "text":
      return <span>{node.value}</span>;

    case "paragraph":
      return <p>{node.children.map(renderNode)}</p>;

    case "emphasis":
      return <em>{node.children.map(renderNode)}</em>;

    case "strong":
      return <strong>{node.children.map(renderNode)}</strong>;

    case "footnoteReference":
      return <sup className="footnote-reference">!{node.index}</sup>;

    // case "footnoteDefinition":
    //   return <sup className="footnote-definitio">!{node.index}</sup>;

    case "delete":
      return <del>{node.children.map(renderNode)}</del>;

    case "inlineCode":
      return <code>{node.value}</code>;

    case "code":
      return (
        <pre>
          <code>{node.value}</code>
        </pre>
      );

    case "blockquote":
      return <blockquote>{node.children.map(renderNode)}</blockquote>;

    case "table":
      return (
        <table>
          {node.children.map((child, idx) =>
            renderNode(child, { tableIndex: idx, parent: node })
          )}
        </table>
      );

    case "tableRow":
      const isHeaderRow = tableIndex === 0;
      return (
        <tr>
          {node.children.map((child, idx) =>
            renderNode(child, {
              tableIndex: idx,
              parent: { ...node, isHeaderRow },
            })
          )}
        </tr>
      );

    case "tableCell":
      const CellTag = parent?.isHeaderRow ? "th" : "td";
      return (
        <CellTag>{node.children.map((child) => renderNode(child))}</CellTag>
      );

    case "break":
      return <br />;

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

    case "html":
      // we need to have a wrapper around the html.
      // mark it to be able to remove it later
      return (
        <span
          className="--node-remove-html-start"
          dangerouslySetInnerHTML={{
            __html: `${node.value}<span class="--node-remove-html-end"></span>`,
          }}
        />
      );

    default:
      console.warn("Unsupported node type: ", node?.type);
      return (
        <>
          <p>!!! ERROR Unsupported node type: {node?.type}</p>
          <pre>{JSON.stringify(node, null, 2)}</pre>
        </>
      );
  }
}
