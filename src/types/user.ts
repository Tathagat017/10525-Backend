import { Types } from "mongoose";

export interface UserHousehold {
  householdId: Types.ObjectId;
  role: UserRole;
}

export type User = {
  _id: Types.ObjectId;
  name: string;
  password?: string;
  email: string;
  profilePictureUrl: string;
  households: UserHousehold[];
};

export type UserRole = "owner" | "member";

export type UserRegisterPayload = {
  name: string;
  email: string;
  password: string;
  profilePictureUrl: string;
};

export type UserLoginPayload = {
  email: string;
  password: string;
};

export type UserRegisterResponse = {
  _id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  households: UserHousehold[];
  token: string;
};

export type UserLoginResponse = {
  _id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  token: string;
  households: UserHousehold[];
};
