import { Injectable } from '@angular/core';
import { asyncScheduler, Observable, scheduled } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokensResponse } from 'src/app/_models/responses/tokens.response';
import { IdNameResponse } from 'src/app/_models/responses/id-name.response';
import { LoginRequest } from 'src/app/_models/requests/login.request';
import { CreateUserRequest } from 'src/app/_models/requests/create-user.request';
import { SaveUserRequest } from 'src/app/_models/requests/save-user.request';
import { ProfileResponse } from 'src/app/_models/responses/profile.response';
import { SaveCompanyRequest } from 'src/app/_models/requests/save-company.request';
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

  public signIn(data: LoginRequest): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((tokens) => {
        this.authService.storeTokens(tokens);
      }),
    );
  }

  public getRoles(): Observable<IdNameResponse[]> {
    return this.http.get<IdNameResponse[]>(`${this.baseUrl}/roles`);
  }

  public getProfileInfo(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/user/profile-info`);
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
        this.router.navigate(['/sign-in']);
      }),
    );
  }

  public signUp(data: CreateUserRequest): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/sign-up`, data).pipe(
      tap((tokens) => {
        this.authService.storeTokens(tokens);
      }),
    );
  }

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user`).pipe(
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

  public updateUser(request: SaveUserRequest): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/user`, request);
  }

  public refreshToken(token: string): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/refresh-token`, { token }).pipe(
      tap((tokens) => {
        this.authService.storeTokens(tokens);
      }),
    );
  }

  public setNewPassword(password: string) {
    return this.http.post(`${this.baseUrl}/update-password`, { password });
  }

  public addCompanyInfo(request: SaveCompanyRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/user/company-info`, request);
  }

  public updateCompanyInfo(request: SaveCompanyRequest): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/user/company-info`, request);
  }

  /**
   * Добавление и изменения досумента пользователя
   * @param request FormData с ключами:
   * { file: File,
   * documentId: number }
   * @returns путь до созданного файла
   */
  public saveDocument(request: FormData): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/user/document`, request);
  }

  public deleteDocument(documentId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/user/document/${documentId}`);
  }
}
