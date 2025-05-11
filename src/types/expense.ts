import { Types } from "mongoose";

export interface ExpenseParticipant {
  user: Types.ObjectId;
  share: number;
}

export interface Expense {
  _id: Types.ObjectId;
  householdId: Types.ObjectId;
  name: string;
  amount: number;
  date: Date;
  payer: Types.ObjectId;
  participants: ExpenseParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpensePayload {
  householdId: Types.ObjectId;
  name: string;
  amount: number;
  date: Date;
  payer: Types.ObjectId;
  participants: ExpenseParticipant[];
}

export interface SettleUpSuggestion {
  from: Types.ObjectId;
  to: Types.ObjectId;
  amount: number;
}

export interface ExpenseBalance {
  [userId: string]: number;
}
