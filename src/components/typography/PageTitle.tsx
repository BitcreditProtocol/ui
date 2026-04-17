import { cn } from "@/lib/utils";

type PageTitleProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

export function PageTitle({ children, className, ...props }: PageTitleProps) {
  return (
    <h1 className={cn("text-text-300 text-base font-medium leading-normal", className)} {...props}>
      {children}
    </h1>
  );
}
