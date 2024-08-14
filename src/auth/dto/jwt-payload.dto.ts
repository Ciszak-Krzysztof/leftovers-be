export interface JwtPayload {
  userId: string;
  email: string;
}

export interface VerifyAccountJwtPayload {
  email: string;
  iat: number;
  exp: number;
}
