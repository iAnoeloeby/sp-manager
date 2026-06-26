// ponytail: register at top level — onInstalled may not fire in crxjs dev mode
chrome.contextMenus.create({
    id: "open-startpage",
    title: "Open Start Page",
    contexts: ["action"],
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "open-startpage") {
        chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
    }
});
