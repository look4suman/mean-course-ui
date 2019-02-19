import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../model/auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(authdata: AuthData) {
    this.http
      .post("http://localhost:3000/api/user/signup", authdata)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(authdata: AuthData) {
    this.http
      .post<{ token: string; expiresIn: number }>(
        "http://localhost:3000/api/user/login",
        authdata
      )
      .subscribe(response => {
        this.token = response.token;
        const expiresIn = response.expiresIn;
        if (this.token) {
          this.isAuthenticated = true;
          this.setAuthTimer(expiresIn);
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(this.token, expirationDate);
          this.router.navigate(["/"]);
        }
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const diff = authInfo.expiresInDate.getTime() - now.getTime();
    if (diff > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(diff / 1000);
      this.authStatusListener.next(true);
    }
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expiresInDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiresInDate", expiresInDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresInDate");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expiresInDate = localStorage.getItem("expiresInDate");
    if (!token || !expiresInDate) {
      return;
    }
    return {
      token: token,
      expiresInDate: new Date(expiresInDate)
    };
  }
}
