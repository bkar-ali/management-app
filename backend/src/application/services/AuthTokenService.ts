export interface AuthTokenService {
  generateToken(userId: number): string;
}
