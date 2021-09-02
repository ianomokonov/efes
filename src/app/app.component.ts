import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserService } from './_services/back/user.service';
import { TokenService } from './_services/front/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  public title = 'efes';
  public items: MenuItem[] = [];

  constructor(public tokenService: TokenService, private userService: UserService) {}

  public ngOnInit() {
    this.items = [
      { label: 'Главная', routerLink: 'home' },
      { label: 'Тарифы', routerLink: 'rates' },
      { label: 'Отзывы', routerLink: 'feedback' },
    ];
  }

  public onExit() {
    this.userService.signOut().subscribe();
  }
}
