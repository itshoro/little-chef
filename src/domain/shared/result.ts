export type Result<TValue, TError extends Error> =
  | {
      ok: true;
      value: TValue;
    }
  | {
      ok: false;
      error: TError;
    };
