type HighlightTextProps = {
  text: string;
  highlight: string;
};

export function HighlightText({ text, highlight }: HighlightTextProps) {
  if (!highlight) {
    return <>{text}</>;
  }

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 text-current rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
