import storageService from "./storageService";

export const wallpaperStorageKey = "spm_wallpaper_v1";

function daysSinceEpoch() {
  return Math.floor(Date.now() / 86400000);
}

function getDailySeed() {
  return new Date().toISOString().slice(0, 10);
}

function getSeed() {
  const extensionId =
    typeof chrome !== "undefined" && chrome.runtime?.id
      ? chrome.runtime.id
      : "local";

  return `${extensionId}-${getDailySeed()}`;
}

function getRandomSeed() {
  return `${getSeed()}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function buildWallpaperUrl(seed) {
  return `https://picsum.photos/seed/${seed}/3840/2160?v=${seed}`;
}

export async function getCurrentWallpaper() {
  return storageService.getItem(wallpaperStorageKey, null);
}

export async function refreshDailyWallpaper(
  force = false,
  options = {},
) {
  const current = await getCurrentWallpaper();
  const today = daysSinceEpoch();
  const forceNewSeed = Boolean(options.forceNewSeed);

  if (!forceNewSeed && !force && current?.day === today) {
    return current;
  }

  const seed = forceNewSeed
    ? getRandomSeed()
    : current?.seed || getSeed();
  const result = {
    url: buildWallpaperUrl(seed),
    seed,
    day: today,
    updatedAt: Date.now(),
  };

  await storageService.setItem(wallpaperStorageKey, result);

  return result;
}

export const refreshLiveWallpaper = refreshDailyWallpaper;
