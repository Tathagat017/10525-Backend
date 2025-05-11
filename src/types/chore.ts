import { Types } from "mongoose";

export type ChoreFrequency = "daily" | "weekly" | "monthly";

interface ChoreHistory {
  user: Types.ObjectId;
  completedAt: Date;
  wasMissed: boolean;
}

export interface Chore {
  _id: Types.ObjectId;
  householdId: Types.ObjectId;
  name: string;
  frequency: ChoreFrequency;
  assignedTo?: Types.ObjectId;
  dueDate: Date;
  isOverDue: boolean;
  rotationIndex: number;
  history: ChoreHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChorePayload {
  householdId: Types.ObjectId;
  name: string;
  frequency: ChoreFrequency;
  assignedTo?: Types.ObjectId;
  dueDate?: Date;
}
