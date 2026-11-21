export const INTRO_STORAGE_KEY = 'daymark-intro-v1'

export function hasSeenIntro(): boolean {
  try {
    return window.localStorage.getItem(INTRO_STORAGE_KEY) === '1'
  } catch {
    return true // fail closed — don't trap users if storage is blocked
  }
}

export function markIntroSeen(): void {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, '1')
  } catch {
    // ignore
  }
}

/** `?intro=1` forces the splash again (useful while designing). */
export function shouldForceIntro(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('intro') === '1'
  } catch {
    return false
  }
}

/** Sync decision for first paint — never wait on useEffect. */
export function shouldShowIntro(): boolean {
  return shouldForceIntro() || !hasSeenIntro()
}

export function dismissBootCover(): void {
  document.getElementById('boot-cover')?.remove()
}
