/**
 * @file Low-level storage adapter.
 * Wraps chrome.storage.sync (extension) or localStorage (fallback)
 * behind a uniform async API. Never touch storage directly elsewhere.
 */

const hasChromeStorage =
  typeof chrome !== "undefined" &&
  Boolean(chrome.storage && chrome.storage.sync);

/** @param {string} value @returns {any | null} */
function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

/** @param {string} key @param {any} fallback @returns {Promise<any>} */
function chromeGet(key, fallback) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result && result[key] !== undefined ? result[key] : fallback);
    });
  });
}

/** @param {string} key @param {any} value @returns {Promise<void>} */
function chromeSet(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => resolve());
  });
}

/** @param {string} key @returns {Promise<void>} */
function chromeRemove(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(key, () => resolve());
  });
}

/**
 * Read a value by key. Returns fallback when key is absent.
 *
 * @param {string} key
 * @param {any} [fallback=null]
 * @returns {Promise<any>}
 */
export async function getItem(key, fallback = null) {
  if (hasChromeStorage) {
    return chromeGet(key, fallback);
  }

  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;

  const parsed = safeParse(raw);
  return parsed ?? fallback;
}

/**
 * Write a value by key.
 *
 * @param {string} key
 * @param {any} value - Serialized as JSON for localStorage
 * @returns {Promise<void>}
 */
export async function setItem(key, value) {
  if (hasChromeStorage) {
    return chromeSet(key, value);
  }

  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove a value by key.
 *
 * @param {string} key
 * @returns {Promise<void>}
 */
export async function removeItem(key) {
  if (hasChromeStorage) {
    return chromeRemove(key);
  }

  localStorage.removeItem(key);
}

/** @type {{ getItem: typeof getItem, setItem: typeof setItem, removeItem: typeof removeItem }} */
const storageAdapter = {
  getItem,
  setItem,
  removeItem,
};

export default storageAdapter;
