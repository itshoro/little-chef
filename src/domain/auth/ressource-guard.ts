export interface ResourceGuard<T> {
  assertCanView(resource: T): Promise<void>;
  assertCanMaintain(resource: T): Promise<void>;
  assertIsOwner(resource: T): Promise<void>;
}
