import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { executeSearch } from "../services/searchService";

const transition = {
    duration: 0.4,
    type: "spring",
    bounce: 0.25,
};

const iconBubbleVariants = {
    collapsed: { x: -20, scale: 0.7, opacity: 0 },
    expanded: { x: 0 + 65, scale: 1, opacity: 1 },
};

const surfaceClass =
    "bg-surface text-foreground border-border/75 hover:border-border/100 aria-expanded:border-border/100 focus-visible:ring-ring/30 drop-shadow-md";

/**
 * @param {Object} props
 * @param {string} props.engineId
 * @param {string} [props.className]
 */
export default function SearchBar({ engineId, className = "" }) {
    const [query, setQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [disabled] = useState(false);

    const reactId = useId();
    const safeId = reactId.replace(/:/g, "");
    const filterId = `filter-${safeId}`;

    const inputRef = useRef(null);

    // Layout config — kept internal since this is single-use and not meant to be customizable
    const collapsedWidth = 500;
    const expandedWidth = 640;
    const expandedOffset = 0;
    const gooeyBlur = 5;
    const placeholder = "Type and press Enter";
    const inputId = "start-page-search";

    useEffect(() => {
        if (isExpanded) {
            inputRef.current?.focus();
        }
    }, [isExpanded]);

    const handleExpand = useCallback(() => {
        if (!disabled) {
            setIsExpanded(true);
        }
    }, [disabled]);

    const handleSubmitEvent = (/** @type {React.FormEvent} */ event) => {
        event.preventDefault();
        if (disabled) return;

        const trimmed = query.trim();
        if (trimmed) {
            executeSearch(trimmed, engineId);
        }
    };
    const handleSubmit = useCallback(handleSubmitEvent, [
        disabled,
        engineId,
        query,
    ]);

    const handlePrimaryAction = useCallback(() => {
        if (disabled) return;

        const trimmed = query.trim();
        if (!isExpanded && !trimmed) {
            setIsExpanded(true);
            return;
        }
        if (trimmed) {
            executeSearch(trimmed, engineId);
        }
    }, [disabled, isExpanded, engineId, query]);

    const handleClearOrCollapse = useCallback(() => {
        if (disabled) return;

        if (query.trim()) {
            setQuery("");
            inputRef.current?.focus();
            setIsExpanded(true);
            return;
        }
        setIsExpanded(false);
    }, [disabled, query]);

    const handleChange = useCallback(
        (/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => {
            setQuery(e.target.value);
        },
        [],
    );

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        if (!query.trim()) {
            setIsExpanded(false);
        }
    }, [query]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        if (!isExpanded && !disabled) {
            setIsExpanded(true);
        }
    }, [disabled, isExpanded]);

    return (
        <div className="flex items-center justify-center">
            <form
                role="search"
                aria-label="Search form"
                onSubmit={handleSubmit}
                className={cn(
                    "relative flex items-center justify-center",
                    className,
                )}
            >
                <InputFilter filterId={filterId} blur={gooeyBlur} />

                <div
                    className="group/search relative w-full flex h-14 items-center justify-center z-10"
                    style={{ filter: `url(#${filterId})` }}
                >
                    <div
                        className="relative flex h-14 items-center justify-center transition-[width,margin-left,transform,opacity] duration-300 ease-out will-change-[width,margin-left,transform,opacity] translate-x-0 opacity-100 z-10"
                        style={{
                            width: isExpanded ? expandedWidth : collapsedWidth,
                            marginLeft: isExpanded ? expandedOffset : 0,
                        }}
                    >
                        <div
                            className={cn(
                                "flex h-14 w-full cursor-text items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium outline-none transition-all focus-within:ring-3 focus-within:ring-ring/30",
                                surfaceClass,
                            )}
                            onClick={handleExpand}
                            role="presentation"
                            aria-expanded={isExpanded}
                        >
                            <input
                                ref={inputRef}
                                id={inputId}
                                type="text"
                                enterKeyHint="search"
                                autoComplete="off"
                                spellCheck={false}
                                value={query}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                disabled={disabled}
                                readOnly={!isExpanded}
                                placeholder={
                                    isFocused && !query.trim()
                                        ? placeholder
                                        : ""
                                }
                                aria-expanded={isExpanded}
                                className={cn(
                                    "h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/25 appearance-none",
                                    isExpanded ? "" : "pointer-events-none",
                                )}
                            />
                            {isExpanded ? (
                                <button
                                    type="button"
                                    disabled={disabled}
                                    onClick={handleClearOrCollapse}
                                    aria-label={
                                        query.trim()
                                            ? "Clear search"
                                            : "Collapse search"
                                    }
                                    className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <ClearIcon />
                                </button>
                            ) : null}
                        </div>
                    </div>

                    <motion.button
                        className={cn(
                            "group/button absolute right-0 z-1 flex size-14 items-center justify-center rounded-full border shadow-sm transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 group-focus-within/search:border-ring/50 group-focus-within/search:ring-2 group-focus-within/search:ring-ring/30 active:translate-y-px aria-expanded:bg-muted",
                            surfaceClass,
                        )}
                        variants={iconBubbleVariants}
                        initial="collapsed"
                        animate={isExpanded ? "expanded" : "collapsed"}
                        transition={transition}
                        type="button"
                        onClick={handlePrimaryAction}
                        aria-label={
                            isExpanded
                                ? "Search"
                                : query.trim()
                                  ? "Search or expand"
                                  : "Expand search"
                        }
                    >
                        <div className="flex size-14 items-center justify-center rounded-full z-10">
                            <MagnifyingGlassIcon size={25} weight="bold" />
                        </div>
                    </motion.button>
                </div>
            </form>
        </div>
    );
}

/**
 * @param {Object} props
 * @param {string} props.filterId
 * @param {number} props.blur
 */
function InputFilter({ filterId, blur }) {
    return (
        <svg className="absolute hidden h-0 w-0" aria-hidden>
            <defs>
                <filter
                    id={filterId}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation={blur}
                        result="blur"
                    />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                        result="goo"
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
            </defs>
        </svg>
    );
}

function ClearIcon() {
    return <XIcon size={16} weight="light" />;
}
