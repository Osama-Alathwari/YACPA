import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly LANG_KEY = 'selected-language';
  private languageSubject = new BehaviorSubject<Language>(this.getInitialLanguage());
  public language$ = this.languageSubject.asObservable();

  constructor(private translateService: TranslateService) {
    // Initialize translate service
    translateService.addLangs(['ar', 'en']);
    translateService.setDefaultLang('ar');
    
    // Apply the initial language
    this.setLanguage(this.languageSubject.value);
  }

  private getInitialLanguage(): Language {
    const savedLang = localStorage.getItem(this.LANG_KEY) as Language;
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
      return savedLang;
    }
    
    // Default to Arabic
    return 'ar';
  }

  setLanguage(lang: Language): void {
    localStorage.setItem(this.LANG_KEY, lang);
    this.languageSubject.next(lang);
    this.translateService.use(lang);
    
    // Update document direction
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update language attribute on html tag
    document.documentElement.lang = lang;
  }

  toggleLanguage(): void {
    const newLang = this.languageSubject.value === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }
}