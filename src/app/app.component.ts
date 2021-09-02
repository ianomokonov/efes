import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  public title = 'efes';
  public items: MenuItem[] = [];

  public ngOnInit() {
    this.items = [
      { label: 'Главная', routerLink: 'home' },
      { label: 'Тарифы', routerLink: 'rates' },
      { label: 'Отзывы', routerLink: 'feedback' },
    ];
  }
}
