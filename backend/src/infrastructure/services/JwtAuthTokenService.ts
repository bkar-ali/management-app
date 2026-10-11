import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import type { AuthTokenService } from "../../application/services/AuthTokenService.js";

export class JwtAuthTokenService implements AuthTokenService {
  generateToken(userId: number): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
  }
}
