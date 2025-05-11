import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import {
  User,
  UserLoginPayload,
  UserLoginResponse,
  UserRegisterPayload,
  UserRegisterResponse,
  UserRole,
} from "../types/user";
import { Types } from "mongoose";

export class AuthStore {
  token: string | null = localStorage.getItem("auth_token");
  user: User | null = JSON.parse(localStorage.getItem("user") || "null");
  role: UserRole | null = localStorage.getItem("user_role") as UserRole;
  queryClient: QueryClient;
  isAuthenticated: boolean = false;
  private baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  constructor(queryClient: QueryClient) {
    makeAutoObservable(this);
    this.queryClient = queryClient;
  }

  get IsAuthenticated() {
    return !!this.token && !!this.user;
  }

  get BaseUrl() {
    return this.baseUrl;
  }

  get Token() {
    return this.token;
  }

  get User(): User | null {
    return this.user;
  }

  get Role() {
    return this.role;
  }

  setAuth(token: string, user: User, role: UserRole | null) {
    runInAction(() => {
      this.token = token;
      this.user = user;
      this.role = role;
      this.isAuthenticated = true;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (role) localStorage.setItem("user_role", role);
    });
  }

  logout() {
    this.token = null;
    this.user = null;
    this.role = null;
    this.isAuthenticated = false;
    localStorage.clear();
  }

  async Register(
    payload: UserRegisterPayload
  ): Promise<UserRegisterResponse | null> {
    try {
      const res: AxiosResponse<UserRegisterResponse> = await axios.post(
        `${this.baseUrl}/api/users/register`,
        payload
      );
      if (res.status === 200) {
        const user = {
          _id: res.data._id as unknown as Types.ObjectId,
          name: res.data.name,
          email: res.data.email,
          profilePictureUrl: res.data.profilePictureUrl,
          households: res.data.households,
        };
        this.setAuth(res.data.token, user, null);
      }
      return res.data;
    } catch (error) {
      console.error("Signup failed:", error);
      return null;
    }
  }

  async loginUser(
    payload: UserLoginPayload
  ): Promise<UserLoginResponse | null> {
    try {
      const res: AxiosResponse<UserLoginResponse> = await axios.post(
        `${this.baseUrl}/api/users/login`,
        payload
      );
      const userData = res.data;
      if (res.status === 200) {
        const user = {
          _id: userData._id as unknown as Types.ObjectId,
          name: userData.name,
          email: userData.email,
          profilePictureUrl: userData.profilePictureUrl,
          households: userData.households,
        };
        if (userData.households.length > 0) {
          this.setAuth(userData.token, user, userData.households[0].role);
        } else {
          this.setAuth(userData.token, user, null);
        }
      }
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  async getUsers(searchQuery?: string): Promise<User[]> {
    try {
      const queryParams = searchQuery ? `?search=${searchQuery}` : "";
      const res: AxiosResponse<User[]> = await axios.post(
        `${this.baseUrl}/api/users/allUsers${queryParams}`,
        {
          userId: this.user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async gerUserProfile(): Promise<User | null> {
    try {
      if (!this.token) {
        throw new Error("No token found");
      }
      const res: AxiosResponse<User> = await axios.post(
        `${this.baseUrl}/api/users/profile`,
        {
          userId: this.user?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      runInAction(() => {
        this.user = res.data;
        this.setAuth(this.token!, this.user, this.role);
      });
      return res.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }

  clearStore() {
    this.logout();
  }
}
