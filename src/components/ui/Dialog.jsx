import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { XIcon } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";

/** @param {React.ComponentProps<typeof DialogPrimitive.Root>} props */
function Dialog(props) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * @param {React.ComponentProps<typeof DialogPrimitive.Trigger>} props
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Trigger>>} ref
 */
const DialogTrigger = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<React.ElementRef<typeof DialogPrimitive.Trigger>, React.ComponentProps<typeof DialogPrimitive.Trigger>>} */
    (
        function DialogTriggerImpl(props, ref) {
            return (
                <DialogPrimitive.Trigger
                    ref={ref}
                    data-slot="dialog-trigger"
                    {...props}
                />
            );
        }
    ),
);
DialogTrigger.displayName = "DialogTrigger";

/** @param {React.ComponentProps<typeof DialogPrimitive.Portal>} props */
function DialogPortal(props) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * @param {React.ComponentProps<typeof DialogPrimitive.Close>} props
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Close>>} ref
 */
const DialogClose = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<React.ElementRef<typeof DialogPrimitive.Close>, React.ComponentProps<typeof DialogPrimitive.Close>>} */
    (
        function DialogCloseImpl(props, ref) {
            return (
                <DialogPrimitive.Close
                    ref={ref}
                    data-slot="dialog-close"
                    {...props}
                />
            );
        }
    ),
);
DialogClose.displayName = "DialogClose";

/**
 * @typedef {React.ComponentProps<typeof DialogPrimitive.Overlay>
 *   & { className?: string }} DialogOverlayProps
 */

/**
 * @param {DialogOverlayProps} props
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>} ref
 */
const DialogOverlay = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<React.ElementRef<typeof DialogPrimitive.Overlay>, DialogOverlayProps>} */
    (
        function DialogOverlayImpl({ className = "", ...props }, ref) {
            return (
                <DialogPrimitive.Overlay
                    ref={ref}
                    data-slot="dialog-overlay"
                    className={cn(
                        "fixed inset-0 isolate z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
                        className,
                    )}
                    {...props}
                />
            );
        }
    ),
);
DialogOverlay.displayName = "DialogOverlay";

/**
 * @typedef {React.ComponentProps<typeof DialogPrimitive.Content>
 *   & { className?: string; showCloseButton?: boolean }} DialogContentProps
 */

/**
 * @param {DialogContentProps} props
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>} ref
 */
const DialogContent = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>} */
    (
        function DialogContentImpl(
            { className = "", children, showCloseButton = true, ...props },
            ref,
        ) {
            return (
                <DialogPortal>
                    <DialogOverlay />
                    <DialogPrimitive.Content
                        ref={ref}
                        data-slot="dialog-content"
                        className={cn(
                            "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-4xl bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none sm:max-w-md dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                            className,
                        )}
                        {...props}
                    >
                        {children}
                        {showCloseButton && (
                            <DialogPrimitive.Close
                                data-slot="dialog-close"
                                asChild
                            >
                                <Button
                                    variant="ghost"
                                    className="absolute top-4 right-4 bg-secondary"
                                    size="icon-sm"
                                >
                                    <XIcon />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </DialogPrimitive.Close>
                        )}
                    </DialogPrimitive.Content>
                </DialogPortal>
            );
        }
    ),
);
DialogContent.displayName = "DialogContent";

/** @typedef {React.HTMLAttributes<HTMLDivElement> & { className?: string }} DialogHeaderProps */

/**
 * @param {DialogHeaderProps} props
 * @param {React.Ref<HTMLDivElement>} ref
 */
const DialogHeader = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<HTMLDivElement, DialogHeaderProps>} */
    (
        function DialogHeaderImpl({ className = "", ...props }, ref) {
            return (
                <div
                    ref={ref}
                    data-slot="dialog-header"
                    className={cn("flex flex-col gap-1.5", className)}
                    {...props}
                />
            );
        }
    ),
);
DialogHeader.displayName = "DialogHeader";

/** @typedef {React.HTMLAttributes<HTMLDivElement> & { className?: string; showCloseButton?: boolean }} DialogFooterProps */

/**
 * @param {DialogFooterProps} props
 * @param {React.Ref<HTMLDivElement>} ref
 */
const DialogFooter = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<HTMLDivElement, DialogFooterProps>} */
    (
        function DialogFooterImpl(
            { className = "", showCloseButton = false, children, ...props },
            ref,
        ) {
            return (
                <div
                    ref={ref}
                    data-slot="dialog-footer"
                    className={cn(
                        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                        className,
                    )}
                    {...props}
                >
                    {children}
                    {showCloseButton && (
                        <DialogPrimitive.Close asChild>
                            <Button variant="outline">Close</Button>
                        </DialogPrimitive.Close>
                    )}
                </div>
            );
        }
    ),
);
DialogFooter.displayName = "DialogFooter";

/** @typedef {React.ComponentProps<typeof DialogPrimitive.Title> & { className?: string }} DialogTitleProps */

/**
 * @param {DialogTitleProps} props
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>} ref
 */
const DialogTitle = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<React.ElementRef<typeof DialogPrimitive.Title>, DialogTitleProps>} */
    (
        function DialogTitleImpl({ className = "", ...props }, ref) {
            return (
                <DialogPrimitive.Title
                    ref={ref}
                    data-slot="dialog-title"
                    className={cn(
                        "font-heading text-base leading-none font-medium",
                        className,
                    )}
                    {...props}
                />
            );
        }
    ),
);
DialogTitle.displayName = "DialogTitle";

/** @typedef {React.ComponentProps<typeof DialogPrimitive.Description> & { className?: string }} DialogDescriptionProps */

/**
 * @param {DialogDescriptionProps} props
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>} ref
 */
const DialogDescription = React.forwardRef(
    /** @type {React.ForwardRefRenderFunction<React.ElementRef<typeof DialogPrimitive.Description>, DialogDescriptionProps>} */
    (
        function DialogDescriptionImpl({ className = "", ...props }, ref) {
            return (
                <DialogPrimitive.Description
                    ref={ref}
                    data-slot="dialog-description"
                    className={cn(
                        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
                        className,
                    )}
                    {...props}
                />
            );
        }
    ),
);
DialogDescription.displayName = "DialogDescription";

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
