import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private token: string;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
}
