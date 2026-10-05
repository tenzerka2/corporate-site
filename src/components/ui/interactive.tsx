"use client";
import { labels } from "@/content/labels";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  hide,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { Check, ChevronDown, Plus } from "lucide-react";
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  reason?: string;
};
export function Select({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const searchable = options.length > 10;
  const filtered = options.filter((option) =>
    option.label
      .toLocaleLowerCase("ru")
      .includes(query.toLocaleLowerCase("ru")),
  );
  const listRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  useEffect(() => {
    labelsRef.current = filtered.map((option) =>
      option.disabled ? null : option.label,
    );
  }, [filtered]);
  const { refs, floatingStyles, context, middlewareData } = useFloating({
    open,
    onOpenChange(next) {
      setOpen(next);
      if (!next) {
        setQuery("");
        setActiveIndex(null);
      }
    },
    placement: "bottom-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      hide({ padding: { top: 72 } }),
      shift({ padding: 16 }),
      size({
        padding: 16,
        apply({ availableHeight, rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
    ],
  });
  useEffect(() => {
    if (!open || !middlewareData.hide?.referenceHidden) return;
    const frame = requestAnimationFrame(() => {
      setOpen(false);
      setQuery("");
    });
    return () => cancelAnimationFrame(frame);
  }, [open, middlewareData.hide?.referenceHidden]);
  const setFloating = refs.setFloating;
  const setReference = refs.setReference;
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const nav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    virtual: true,
    disabledIndices: filtered.flatMap((item, index) =>
      item.disabled ? [index] : [],
    ),
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
    enabled: !searchable,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, nav, typeahead],
  );
  const selected = options.find((option) => option.value === value);
  function choose(index: number) {
    const option = filtered[index];
    if (option && !option.disabled) {
      onChange(option.value);
      setOpen(false);
      setQuery("");
      (refs.domReference.current as HTMLButtonElement | null)?.focus();
    }
  }
  return (
    <>
      <button
        ref={(node) => setReference(node)}
        id={id}
        type="button"
        className="input select-trigger"
        {...getReferenceProps({
          role: "combobox",
          "aria-label": label,
          "aria-expanded": open,
          "aria-controls": open ? `${id}-list` : undefined,
          "aria-activedescendant":
            open && activeIndex !== null
              ? `${id}-option-${activeIndex}`
              : undefined,
          onKeyDown(event) {
            if (open && event.key === "Enter" && activeIndex !== null) {
              event.preventDefault();
              choose(activeIndex);
            }
          },
        })}
      >
        {selected?.label || labels.vyberiteVariant}
        <ChevronDown size={18} />
      </button>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={searchable ? 0 : -1}
          >
            <div
              ref={(node) => setFloating(node)}
              style={floatingStyles}
              className="select-popover"
              {...getFloatingProps({ role: undefined })}
            >
              {searchable && (
                <input
                  aria-label={`Поиск: ${label}`}
                  className="input select-search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && activeIndex !== null) {
                      e.preventDefault();
                      choose(activeIndex);
                    }
                  }}
                />
              )}
              <div id={`${id}-list`} role="listbox" aria-label={label}>
                {filtered.length === 0 && (
                  <p className="select-option">{labels.nichegoNeNaydeno}</p>
                )}
                {filtered.map((option, index) => (
                  <div
                    key={option.value}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={option.value === value}
                    aria-disabled={option.disabled || undefined}
                    ref={(node) => {
                      listRef.current[index] = node;
                    }}
                    className={`select-option ${activeIndex === index ? "active" : ""}`}
                    {...getItemProps({ onClick: () => choose(index) })}
                  >
                    <span>
                      {option.label}
                      {option.reason && <small>{option.reason}</small>}
                    </span>
                    {option.value === value && <Check size={16} />}
                  </div>
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
export function Tabs({
  items,
}: {
  items: { label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div>
      <div
        className="tabs"
        role="tablist"
        aria-label={labels.variantyPerevozki}
      >
        {items.map((item, index) => (
          <button
            key={item.label}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={active === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % items.length;
              else if (event.key === "ArrowLeft")
                next = (index - 1 + items.length) % items.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = items.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              refs.current[next]?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          className="tab-panel"
          key={item.label}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
export function Accordion({
  items,
}: {
  items: { title: string; content: string }[];
}) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={item.title}>
          <h3>
            <button
              aria-expanded={active === index}
              aria-controls={`${id}-${index}`}
              onClick={() => setActive(active === index ? null : index)}
            >
              {item.title}
              <Plus className={active === index ? "rotated" : ""} size={20} />
            </button>
          </h3>
          <div id={`${id}-${index}`} hidden={active !== index}>
            <p className="measure muted">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
