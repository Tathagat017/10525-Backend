import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

import { Household, HouseholdPayload } from "../types/household";
import { User, UserHousehold } from "../types/user";
import { Types } from "mongoose";
import {
  Expense,
  ExpenseBalance,
  ExpensePayload,
  SettleUpSuggestion,
} from "../types/expense";
import { CalendarEvent } from "../types/calendar";
import { HistoryEntry } from "../types/history";

export class HouseHoldStore {
  houseHold: Household | null = null;
  queryClient: QueryClient;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    makeAutoObservable(this);
  }

  get houseHoldData() {
    return this.houseHold;
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

  async createHouseHold(payload: HouseholdPayload) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<Household>(
        `${this.baseUrl}/api/households`,
        payload,
        this.authHeaders
      );
      runInAction(() => {
        this.houseHold = data;
        this.queryClient.invalidateQueries({ queryKey: ["household"] });
        this.queryClient.invalidateQueries({ queryKey: ["users"] });
        this.queryClient.invalidateQueries({ queryKey: ["user"] });
      });

      this.mutateUserFromLocalStorage({
        householdId: data._id,
        role: "owner",
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getAllUserHouseHolds(userId?: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<Household[]>(
        `${this.baseUrl}/api/households/mine`,
        { userId },
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async getHouseholdById(id: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<Household>(
        `${this.baseUrl}/api/households/${id}`
      );
      runInAction(() => {
        this.houseHold = data;
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return null;
    }
  }

  async createExpense(payload: ExpensePayload) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<Expense>(
        `${this.baseUrl}/api/expenses`,
        payload,
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: ["expenses"] });
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getExpenses(householdId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<Expense[]>(
        `${this.baseUrl}/api/expenses/expense/${householdId}`,
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getExpenseById(expenseId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<Expense>(
        `${this.baseUrl}/api/expenses/${expenseId}`,
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async updateExpense(expenseId: Types.ObjectId, payload: ExpensePayload) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.put<Expense>(
        `${this.baseUrl}/api/expenses/${expenseId}`,
        payload,
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getBalances(householdId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<ExpenseBalance[]>(
        `${this.baseUrl}/api/expenses/balance/${householdId}`,
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getSettleUpSuggestions(householdId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<SettleUpSuggestion[]>(
        `${this.baseUrl}/api/expenses/settle-up/${householdId}`,
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getCalendarEvents(householdId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.get<CalendarEvent[]>(
        `${this.baseUrl}/api/calendar/${householdId}`,
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async sendInvite(householdId: Types.ObjectId, userId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<{ success: boolean }>(
        `${this.baseUrl}/api/households/single/${householdId}/invite`,
        { householdId, userId },
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: ["household"] });
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async sendBulkInvite(householdId: Types.ObjectId, userIds: Types.ObjectId[]) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<{ success: boolean }>(
        `${this.baseUrl}/api/households/bulk/${householdId}/invite`,
        { userIds },
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: ["household"] });
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async joinHousehold(inviteCode: string) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<{ success: boolean }>(
        `${this.baseUrl}/api/households/join`,
        { inviteCode },
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: ["household"] });
        this.queryClient.invalidateQueries({ queryKey: ["users"] });
        this.queryClient.invalidateQueries({ queryKey: ["user"] });
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async removeMember(householdId: Types.ObjectId, userId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<{ success: boolean }>(
        `${this.baseUrl}/api/households/deleteMember/${householdId}/members/${userId}`,
        { householdId, userId },
        this.authHeaders
      );
      runInAction(() => {
        this.queryClient.invalidateQueries({ queryKey: ["household"] });
        this.queryClient.invalidateQueries({ queryKey: ["users"] });
        this.queryClient.invalidateQueries({ queryKey: ["user"] });
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async getHistory(householdId: Types.ObjectId) {
    try {
      const { data } = await axios.get<HistoryEntry[]>(
        `${this.baseUrl}/api/history/previous/${householdId}`
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async exportHistoryToCSV(householdId: Types.ObjectId) {
    try {
      const { data } = await axios.get<string>(
        `${this.baseUrl}/api/history/export/${householdId}`
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async removeSelfFromHousehold(householdId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const user = this.loadUserFromLocalStorage();
      if (!user) {
        throw new Error("No user found");
      }
      const { data } = await axios.post<{ success: boolean }>(
        `${this.baseUrl}/api/households/selfRemove/${householdId}`,
        { householdId, userId: user._id },
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async deleteHousehold(householdId: Types.ObjectId) {
    try {
      if (!this.authHeaders) {
        throw new Error("No auth headers available");
      }
      const { data } = await axios.post<{ success: boolean }>(
        `${this.baseUrl}/api/households/delete/${householdId}`,
        { householdId },
        this.authHeaders
      );
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  clearStore() {
    this.houseHold = null;
  }
}
