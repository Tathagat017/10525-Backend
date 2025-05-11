import { Types } from "mongoose";

export interface Household {
  _id: Types.ObjectId;
  name: string;
  inviteCode: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  pendingInvites?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HouseholdPayload {
  name: string;
}
