import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokensResponse } from 'src/app/_models/responses/tokens.response';
import { environment } from '../../../environments/environment';
import { refreshTokenKey, tokenKey } from '../../_utils/constants';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getRefreshToken() {
    return localStorage.getItem(refreshTokenKey);
  }

  public getToken() {
    return localStorage.getItem(tokenKey);
  }

  public storeTokens(tokens: TokensResponse) {
    localStorage.setItem(tokenKey, tokens.token);
    localStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }

  public removeTokens() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshTokenKey);
  }
}
