export function PersonaTag({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.length > 0 && (
        <span className="flex gap-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-muted text-muted-foreground border-muted-foreground/10 rounded-full border px-2 py-0.5 text-xs"
            >
              {tag}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}
