export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      isAllowed?: boolean;
    };
  }
}
