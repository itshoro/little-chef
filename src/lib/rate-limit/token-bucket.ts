type Bucket = {
  count: number;
  refilledAt: number;
};

export class TokenBucketRateLimit<Key> {
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
      const bucket = {
        count: this.max - cost,
        refilledAt: now,
      };

      this.storage.set(key, bucket);
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
    console.log(bucket.count);
    this.storage.set(key, bucket);
    return true;
  }
}
