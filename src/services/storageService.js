const hasChromeStorage =
  typeof chrome !== "undefined" &&
  Boolean(chrome.storage && chrome.storage.sync);

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function chromeGet(key, fallback) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result && result[key] !== undefined ? result[key] : fallback);
    });
  });
}

function chromeSet(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => resolve());
  });
}

function chromeRemove(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(key, () => resolve());
  });
}

export async function getItem(key, fallback = null) {
  if (hasChromeStorage) {
    return chromeGet(key, fallback);
  }

  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;

  const parsed = safeParse(raw);
  return parsed ?? fallback;
}

export async function setItem(key, value) {
  if (hasChromeStorage) {
    return chromeSet(key, value);
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key) {
  if (hasChromeStorage) {
    return chromeRemove(key);
  }

  localStorage.removeItem(key);
}

const storageService = {
  getItem,
  setItem,
  removeItem,
};

export default storageService;
