export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  username: string;
  email: string;
  password: string;
  type: string;
}

export interface IVerifyCode {
  email: string;
  verifyCode: string;
}

export interface IUpdateTokenPerMessage {
  token: number;
}
