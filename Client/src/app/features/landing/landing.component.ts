import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  features = [
    {
      icon: 'pi pi-users',
      title: 'landing.features.memberManagement',
      description: 'landing.features.memberManagement'
    },
    {
      icon: 'pi pi-calendar',
      title: 'landing.features.subscriptionTracking',
      description: 'landing.features.subscriptionTracking'
    },
    {
      icon: 'pi pi-chart-bar',
      title: 'landing.features.reporting',
      description: 'landing.features.reporting'
    },
    {
      icon: 'pi pi-id-card',
      title: 'landing.features.memberCards',
      description: 'landing.features.memberCards'
    }
  ];
}