import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  /** Used as the React key and the accordion value; falls back to `item-<index>`. */
  id?: string;
  question: ReactNode;
  answer: ReactNode;
}

export interface FaqProps extends Omit<
  ComponentProps<"section">,
  "title" | "defaultValue"
> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items?: FaqItem[];
  /** "split" puts the header on the left and the questions on the right on large screens. */
  layout?: "stacked" | "split";
  /** "single" keeps one answer open at a time; "multiple" lets several stay open. */
  type?: "single" | "multiple";
  /** Item value(s) open on first render: an item's `id`, or `item-<index>`. */
  defaultValue?: string | string[];
  /** Shown under the header, e.g. a link to contact. Pass `null` to hide. */
  footer?: ReactNode;
}

const DEFAULT_ITEMS: FaqItem[] = [
  {
    id: "dp750-scope",
    question: "What is Microsoft DP-750: Azure Databricks Data Engineer?",
    answer:
      "DP-750 is Microsoft's certification assessing end-to-end expertise in designing, building, and maintaining enterprise data systems on Azure Databricks. It covers workspace architecture, Unity Catalog security and governance, medallion streaming ingestion (Auto Loader, CDC), and Lakeflow orchestration with Databricks Asset Bundles (DABs).",
  },
  {
    id: "practice-engine",
    question: "How do the 181 practice quizzes and 12 enterprise labs work?",
    answer:
      "The practice quiz simulator includes 181 scenario-based multiple choice questions mapped to the 4 core exam domains with detailed explanations. The 12 hands-on labs provide step-by-step production guides covering cluster setup, Delta Lake optimization, and CI/CD automation.",
  },
  {
    id: "data-privacy",
    question: "Where is my study progress and Pomodoro data stored?",
    answer:
      "100% locally on your machine using browser LocalStorage. No tracking cookies or remote servers log your data. Your completed lessons, Pomodoro focus time, and readiness scores persist safely even when refreshing or reopening your browser.",
  },
  {
    id: "free-access",
    question: "Can I use the labs without an Azure subscription?",
    answer:
      "Yes. Most conceptual patterns and PySpark scripts can be tested locally or with the free Databricks Community Edition, while the lab documentation clearly shows the enterprise Azure portal configurations.",
  },
  {
    id: "readiness-score",
    question: "How is the Exam Readiness Score calculated?",
    answer:
      "Your readiness score dynamically aggregates verified completion across all 51 Module 1 lessons, 23 Module 2 lessons, 52 Module 3 lessons, 45 Module 4 lessons, and 12 labs, powering the live SVG performance curve on the dashboard.",
  },
  {
    id: "open-source",
    question: "How do I report an erratum or contribute?",
    answer:
      "This study portal is open-source on GitHub and maintained by Balasubramanian PG. You can report questions, open issues, or submit pull requests directly through our GitHub repository.",
  },
];

const DEFAULT_FOOTER = (
  <>
    Have more questions?{" "}
    <a
      href="https://github.com/Balasubramanian-pg/DP-750/issues"
      target="_blank"
      rel="noopener"
      className="text-foreground focus-visible:ring-ring/50 rounded font-medium underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-[3px]"
    >
      Open an issue on GitHub
    </a>
  </>
);

/**
 * A frequently asked questions section: a header and the questions in an
 * accordion. The default "split" layout puts the header on the left and the
 * questions on the right on large screens; "stacked" centres the header above
 * a narrower list. `type="single"` (the default) keeps one answer open and
 * lets it close again; `type="multiple"` lets several stay open.
 * `defaultValue` opens items by `id` (or `item-<index>` when there is none).
 * `footer` replaces the "Still have questions?" line.
 */
function Faq({
  className,
  eyebrow = "FAQ",
  title = "Frequently Asked Questions",
  description = "Everything you need to know about preparing for the DP-750 certification exam and using this study portal.",
  items = DEFAULT_ITEMS,
  layout = "split",
  type = "single",
  defaultValue,
  footer = DEFAULT_FOOTER,
  ...props
}: FaqProps) {
  const split = layout === "split";
  const hasHeader =
    eyebrow != null || title != null || description != null || footer != null;

  const entries = items.map((item, index) => (
    <AccordionItem
      key={item.id ?? index}
      value={item.id ?? `item-${index}`}
      data-slot="faq-item"
    >
      <AccordionTrigger data-slot="faq-question" className="text-base text-left">
        {item.question}
      </AccordionTrigger>
      <AccordionContent
        data-slot="faq-answer"
        className="text-muted-foreground text-base leading-relaxed"
      >
        {item.answer}
      </AccordionContent>
    </AccordionItem>
  ));

  const listClassName = cn(
    "w-full",
    !split && "mx-auto max-w-3xl",
    !split && hasHeader && "mt-12",
  );

  return (
    <section
      data-slot="faq"
      data-layout={layout}
      className={cn("py-16 sm:py-24 bg-[#0D0E12] text-[#F3F4F6]", className)}
      {...props}
    >
      <div
        data-slot="faq-container"
        className={cn(
          "mx-auto w-full max-w-6xl px-4 sm:px-6",
          split && "grid gap-12 lg:grid-cols-[1fr_2fr]",
        )}
      >
        {hasHeader ? (
          <div
            data-slot="faq-header"
            className={cn("max-w-2xl", !split && "mx-auto text-center")}
          >
            {eyebrow != null ? (
              <p
                data-slot="faq-eyebrow"
                className="text-purple-400 text-sm font-semibold tracking-wider uppercase"
              >
                {eyebrow}
              </p>
            ) : null}
            {title != null ? (
              <h2
                data-slot="faq-title"
                className={cn(
                  "text-3xl font-semibold tracking-tight text-balance sm:text-4xl text-white",
                  eyebrow != null && "mt-2",
                )}
              >
                {title}
              </h2>
            ) : null}
            {description != null ? (
              <p
                data-slot="faq-description"
                className="text-gray-400 mt-4 text-lg text-pretty"
              >
                {description}
              </p>
            ) : null}
            {footer != null ? (
              <p
                data-slot="faq-footer"
                className="text-gray-400 mt-6 text-sm"
              >
                {footer}
              </p>
            ) : null}
          </div>
        ) : null}
        {type === "multiple" ? (
          <Accordion
            type="multiple"
            data-slot="faq-list"
            className={listClassName}
            defaultValue={
              defaultValue === undefined
                ? undefined
                : Array.isArray(defaultValue)
                  ? defaultValue
                  : [defaultValue]
            }
          >
            {entries}
          </Accordion>
        ) : (
          <Accordion
            type="single"
            collapsible
            data-slot="faq-list"
            className={listClassName}
            defaultValue={
              Array.isArray(defaultValue) ? defaultValue[0] : defaultValue
            }
          >
            {entries}
          </Accordion>
        )}
      </div>
    </section>
  );
}

export { Faq };
export default Faq;
