import { Component } from '@angular/core';
import { UserService } from './_services/back/user.service';
import { TokenService } from './_services/front/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public title = 'efes';

  constructor(public tokenService: TokenService, private userService: UserService) {}

  public onExit() {
    this.userService.signOut().subscribe();
  }
}
