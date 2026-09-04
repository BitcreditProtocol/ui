import { Text } from "@/components/typography/Text";
import { Button } from "@/components/ui/button";

type SearchEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onClearSearch: () => void;
};

/**
 * Shown in place of the list when a drawer search matches nothing: a centred
 * message plus a button that drops the query and brings the full list back.
 */
export default function SearchEmptyState({ title, description, actionLabel, onClearSearch }: SearchEmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <Text variant="titleMd" as="p" className="max-w-[230px] leading-[30px]">
            {title}
          </Text>
          <Text variant="bodyMuted" as="p" className="max-w-[230px]">
            {description}
          </Text>
        </div>

        <Button type="button" variant="outline" size="xs" className="leading-[18px]" onClick={onClearSearch}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
