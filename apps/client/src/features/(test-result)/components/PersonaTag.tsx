interface PersonaTagProps {
  tags: string[];
  maxShowCount?: number;
}

export function PersonaTag({ tags, maxShowCount = 3 }: PersonaTagProps) {
  const displayedTags = tags.slice(0, maxShowCount);
  const remainingCount = tags.length - maxShowCount;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {displayedTags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-muted text-muted-foreground border-muted-foreground/10 rounded-full border px-2 py-0.5 text-xs whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="text-muted-foreground text-xs whitespace-nowrap">외 {remainingCount}</span>
      )}
    </div>
  );
}
