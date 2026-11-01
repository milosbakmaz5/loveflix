import { atom } from 'jotai';

/**
 * FlashList draws the pinned genre bar as a second copy of its row. Both copies share this
 * horizontal offset so the chips don't jump when the bar sticks or unsticks.
 */
export const genreBarOffsetAtom = atom(0);
