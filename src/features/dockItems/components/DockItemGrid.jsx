import React from "react";
import { ItemGrid } from "@/components/ui/ItemGrid";
import { ItemAdd, Item } from "@/components/ui/Item";
import { cn } from "@/lib/utils";
import { ShortcutIcon } from "@/features/shortcuts/components/ShortcutIcon";

/**
 * @typedef {import("../services/dockItemsService").DockItem} DockItem
 * @typedef {import("../services/dockItemsService").DockItemType} DockItemType
 *
 * @typedef {Object} DockItemGridProps
 * @property {string} [area]
 * @property {DockItem[]} items
 * @property {string} [className]
 * @property {(item: { type: DockItemType, name: string, url: string }) => void} [onAdd]
 * @property {(id: string) => void} [onDelete]
 */

/**
 * Pure presentational grid untuk DockItem[]. Mengonversi setiap DockItem
 * menjadi item dengan shape yang dipahami oleh `ItemGrid`:
 *
 *   { type, url, content }
 *
 * - `type` di sini hanya dipakai oleh `ItemGrid.ItemWrapper` untuk memilih
 *   antara `<a>` (untuk item yang punya URL) dan `<button>`. Karena
 *   semua `DockItem` dengan `type` "shortcut" / "link" pasti punya URL,
 *   dan "button" boleh tidak punya URL, kita turunkan ke:
 *     - "url"    → jika item.url non-kosong
 *     - "action" → jika item.url kosong (item.type === "button" tanpa url)
 * - `content` adalah `<DockItemRenderer>` yang menampilkan representasi
 *   visual sesuai `DockItem.type` (button / link / shortcut).
 *
 * Tile `+` di akhir grid hanya muncul jika `onAdd` diberikan
 * (yaitu saat slot sedang dalam mode edit).
 *
 * `onDelete` saat ini hanya diteruskan untuk konsistensi API; tile di
 * grid tidak menampilkan kontrol delete inline (delete dilakukan lewat
 * context menu / global "Remove all").
 *
 * @param {DockItemGridProps} props
 */
export default function DockItemGrid({
    area = "dock",
    items,
    className = "",
    onAdd,
    onDelete: _onDelete,
}) {
    /** @type {{ type: "url" | "action", url?: string, content: React.ReactNode, id?: string }[]} */
    const finalItems = [
        ...items.map((item) => ({
            type: item.url ? "url" : "action",
            url: item.url,
            content: (
                <Item
                    onClick={item.url ? undefined : () => _onDelete?.(item.id)}
                >
                    <ShortcutIcon shortcut={item} />
                </Item>
            ),
        })),
        ...(onAdd
            ? [
                  {
                      type: "action",
                      onClick: onAdd,
                      content: <ItemAdd actions={onAdd} />,
                  },
              ]
            : []),
    ];

    return <ItemGrid items={finalItems} className={cn(className)} />;
}
