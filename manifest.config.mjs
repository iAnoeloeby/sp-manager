import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json" with { type: "json" };

export default defineManifest({
    manifest_version: 3,
    name: "Start Page Manager",
    version: packageJson.version,
    description: packageJson.description,
    chrome_url_overrides: {
        newtab: "newtab.html",
    },
    background: {
        service_worker: "src/services/developerService.js",
    },
    permissions: ["storage", "contextMenus"],
    icons: {
        16: "icons/icon-16.png",
        48: "icons/icon-48.png",
        128: "icons/icon-128.png",
    },
});
