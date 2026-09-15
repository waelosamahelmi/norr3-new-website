/** Skills as quiet outlined chips. */
export function SkillChips({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <li
          key={skill}
          className="rounded-full border border-ink/15 bg-offwhite px-3.5 py-1.5 text-[13px] text-ink/80 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/80"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
