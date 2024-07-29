export interface IUser {
  email: string,
  password: string,
  name: string,
  type: {
    type: string,
    default: 'user'
  }
}
