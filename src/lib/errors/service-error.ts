class ServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ServiceError";
  }
}

export { ServiceError };
