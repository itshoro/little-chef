export class UnauthenticatedError extends Error {
  constructor(message = "User is unauthenticated", options?: ErrorOptions) {
    super(message, options);
    this.name = "UnauthenticatedError";
  }
}
