export type User = {
  userId: number;
  username: string;
  email: string;
  emailVerified: boolean;
};
export type LoginUser = {
  userId: number;
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
};

export type CurrentAuthUser = {
  userId: number;
  username: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  emailVerified: boolean;
  profilePictureUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  emailVerificationToken: string;
  emailVerificationExpires: Date;
};
