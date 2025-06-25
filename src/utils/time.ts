/** Milliseconds right now. */
export const nowMs = () => Date.now();

/** Integer seconds that have elapsed since a millisecond timestamp. */
export const elapsedSeconds = (startMs: number) =>
  Math.floor((nowMs() - startMs) / 1_000);
