import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from './_services/back/user.service';
import { TokenService } from './_services/front/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public title = 'efes';
  public url: string = '';

  constructor(
    public tokenService: TokenService,
    private userService: UserService,
    private router: Router,
  ) {
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.url = event.urlAfterRedirects;
      });
  }

  public onExit() {
    this.userService.signOut().subscribe();
  }

  public get isAuthorized(): string | null {
    return this.tokenService.getRefreshToken();
  }
}
