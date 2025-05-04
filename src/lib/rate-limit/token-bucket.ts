type Bucket = {
  count: number;
  refilledAt: number;
};

export class TokenBucket<Key> {
  public max: number;
  public refillIntervalSeconds: number;

  private storage = new Map<Key, Bucket>();

  constructor(max: number, refillIntervalSeconds: number) {
    this.max = max;
    this.refillIntervalSeconds = refillIntervalSeconds;
  }

  public consume(key: Key, cost: number) {
    const now = Date.now();

    if (!this.storage.has(key)) {
      this.storage.set(key, {
        count: this.max - cost,
        refilledAt: now,
      });
      return true;
    }

    const bucket = this.storage.get(key)!;
    const elapsed = now - bucket.refilledAt;
    const refill = Math.floor(elapsed / (this.refillIntervalSeconds * 1000));
    bucket.count = Math.min(bucket.count + refill, this.max);
    bucket.refilledAt += refill * this.refillIntervalSeconds * 1000;

    if (bucket.count < cost) {
      return false;
    }

    bucket.count -= cost;
    this.storage.set(key, bucket);
    return true;
  }

  public retryAfter(key: Key, requiredTokens: number) {
    if (requiredTokens > this.max) {
      throw new Error("Required tokens exceed the maximum limit.");
    }

    if (!this.storage.has(key)) {
      return 0;
    }

    const { count } = this.storage.get(key)!;
    const missingTokens = requiredTokens - count;
    if (missingTokens <= 0) {
      return 0;
    }

    return Math.ceil(missingTokens * this.refillIntervalSeconds * 1000);
  }
}
