// Helper function to convert entries to markdown
export function entriesToMarkdown(entries, type) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : entry.startDate && entry.endDate
          ? `${entry.startDate} - ${entry.endDate}`
          : entry.startDate
          ? entry.startDate
          : "";
        
        const titleLine = entry.organization
          ? `### ${entry.title} @ ${entry.organization}`
          : `### ${entry.title}`;
        
        const projectLink = entry.projectLink
          ? `\n🔗 [View Project](${entry.projectLink})`
          : "";
        
        return `${titleLine}${dateRange ? `\n${dateRange}` : ""}${projectLink}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}
