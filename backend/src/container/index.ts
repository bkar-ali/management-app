import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository.js";
import { BcryptPasswordOperations } from "../infrastructure/services/BcryptPasswordOperations.js";
import { ResendEmailService } from "../infrastructure/services/ResendEmailService.js";
import { JwtAuthTokenService } from "../infrastructure/services/JwtAuthTokenService.js";

const userRepository = new PrismaUserRepository();
const passwordOperations = new BcryptPasswordOperations();
const emailService = new ResendEmailService();
const authTokenService = new JwtAuthTokenService();

export { userRepository, passwordOperations, emailService, authTokenService };
