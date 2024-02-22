export interface signInForm {
  id?: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export interface signUpForm {
  id?: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export interface updateAccountForm {
  id?: number;
  username: string;
  password: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
