import { Injectable } from '@angular/core';
import { asyncScheduler, Observable, scheduled } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokensResponse } from 'src/app/_models/responses/tokens.response';
import { TokenService } from '../front/token.service';
import { environment } from '../../../environments/environment';
import { User } from '../../_entities/user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.baseUrl;
  private user: User | undefined;

  constructor(
    private http: HttpClient,
    private authService: TokenService,
    private router: Router,
  ) {}

  public signIn(data: any): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((tokens) => {
        this.authService.storeTokens(tokens);
      }),
    );
  }

  public signOut() {
    const token = this.authService.getRefreshToken();
    return (
      token
        ? this.http.post<string>(`${this.baseUrl}/delete-token`, {
            token: this.authService.getRefreshToken(),
          })
        : scheduled('', asyncScheduler)
    ).pipe(
      tap(() => {
        this.authService.removeTokens();
        delete this.user;
        this.router.navigate(['/']);
      }),
    );
  }

  public signUp(data: any): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/sign-up`, data).pipe(
      tap((tokens) => {
        this.authService.storeTokens(tokens);
      }),
    );
  }

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/user-info`).pipe(
      tap((user) => {
        this.user = user;
      }),
    );
  }

  public checkAdmin(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/user/check-admin`);
  }

  public refreshPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/update-password`, { email });
  }

  public refreshToken(token: string): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/refresh-token`, { token }).pipe(
      tap((tokens) => {
        this.authService.storeTokens(tokens);
      }),
    );
  }

  public setNewPassword(password: string) {
    return this.http.post(`${this.baseUrl}/user/update-password`, { password });
  }
}
