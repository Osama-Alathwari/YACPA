import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ButtonModule,
    MenubarModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  
  constructor(
    public themeService: ThemeService,
    public translationService: TranslationService
  ) {}

  ngOnInit() {
    this.initMenu();
  }

  initMenu() {
    this.items = [
      {
        label: 'nav.home',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'nav.members',
        icon: 'pi pi-users',
        routerLink: '/members'
      },
      {
        label: 'nav.subscriptions',
        icon: 'pi pi-calendar',
        routerLink: '/subscriptions'
      },
      {
        label: 'nav.reports',
        icon: 'pi pi-chart-bar',
        routerLink: '/reports'
      },
      {
        label: 'nav.settings',
        icon: 'pi pi-cog',
        routerLink: '/settings'
      }
    ];
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }
}