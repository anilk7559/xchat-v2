import { IUser } from './user';

export interface INotification {
  _id: string;
  read: boolean;
  refId: string;
  text: string;
  type: string;
  userId: string;
  value: number;
  userAvartarUrl: string;
  updatedAt: string;
  createdAt: string;
  user: IUser;
}
