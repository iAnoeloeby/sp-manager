import React, { useState } from "react";
import { executeSearch } from "../services/searchService";

export default function SearchBar({ engineId }) {
    const [query, setQuery] = useState("");

    function handleSubmit(event) {
        event.preventDefault();
        executeSearch(query, engineId);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-label="Search form"
        >
            <div className="flex items-end justify-between gap-3">
                <div>
                    <label
                        className="block text-sm font-semibold text-foreground"
                        htmlFor="start-page-search"
                    >
                        Search the web
                    </label>
                    <p className="mt-1 text-sm text-muted">
                        Fast search with your default engine.
                    </p>
                </div>
                <span className="hidden rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs font-medium text-muted md:inline-flex">
                    Press Enter
                </span>
            </div>
            <div className="flex items-center gap-2 rounded-3xl border border-border/70 bg-background/55 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="size-6 fill-muted"
                >
                    <path d="M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z" />
                </svg>
                <input
                    id="start-page-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Type and press Enter"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base text-foreground placeholder:text-muted outline-none"
                />
                <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-md transition-all duration-200 hover:-translate-y-px hover:opacity-95 hover:shadow-lg"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
