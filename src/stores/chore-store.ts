import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

import { Types } from "mongoose";
import { Chore, ChorePayload } from "../types/chore";
import { User, UserHousehold } from "../types/user";

export class ChoreStore {
  chores: Chore[] | null = null;
  queryClient: QueryClient;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
  }

  get choresData() {
    return this.chores;
  }

  private loadTokenFromLocalStorage(): string | null {
    return localStorage.getItem("auth_token") ?? null;
  }

  private loadUserFromLocalStorage(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  private mutateUserFromLocalStorage(houseHold: UserHousehold) {
    const user = this.loadUserFromLocalStorage();
    if (user) {
      user.households.push(houseHold);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  private get authHeaders() {
    const token = this.loadTokenFromLocalStorage();
    if (!token) {
      return null;
    }
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};
  }

  async createChore(payload: ChorePayload) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<Chore>(
        `${this.baseUrl}/api/chores/add`,
        payload,
        this.authHeaders
      );
      runInAction(() => {
        this.chores = [...(this.chores ?? []), data];
        this.queryClient.invalidateQueries({ queryKey: ["chores"] });
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getAllChoresByHouseholdId(householdId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<Chore[]>(
        `${this.baseUrl}/api/chores/allChores/${householdId}`,
        { householdId },
        this.authHeaders
      );
      runInAction(() => {
        this.chores = data;
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async getChoreById(id: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<Chore>(
        `${this.baseUrl}/api/chores/singleChore/${id}`
      );
      runInAction(() => {
        if (this.chores && data) {
          this.chores = this.chores.map((chore) =>
            chore._id === id ? data : chore
          );
        }
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async markChoreAsComplete(id: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.patch<Chore>(
        `${this.baseUrl}/api/chores/mark/${id}/complete`,
        {},
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: ["chores"] });
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  clearStore() {
    this.chores = null;
  }
}
