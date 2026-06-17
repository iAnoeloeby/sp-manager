import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyToClipboard(delay = 1500) {
    const timeoutRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(
        async (value) => {
            if (!navigator?.clipboard) {
                return false;
            }

            try {
                await navigator.clipboard.writeText(String(value));

                setIsCopied(true);

                clearTimeout(timeoutRef.current);

                timeoutRef.current = setTimeout(() => {
                    setIsCopied(false);
                }, delay);

                return true;
            } catch (error) {
                console.error(error);

                setIsCopied(false);

                return false;
            }
        },
        [delay],
    );

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return {
        copyToClipboard,
        isCopied,
    };
}
