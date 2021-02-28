import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { format } from 'date-fns';
import es from 'date-fns/locale/es';


import { Country } from '@models/country.model';

import { PhrasesService } from '@services/phrases.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

  phrase: string;
  countries: Country[] = [];

  formatToShow = 'hh:mm aaaa';
  currentTimeNumber;
  currentTime;
  currentDate;
  correntCountry = 'Colombia';

  constructor(
    private phrasesService: PhrasesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.init();
  }

  init() {
    this.currentTimeNumber = new Date().getTime();
    this.currentTime = format(new Date(), this.formatToShow);
    this.phrase = this.phrasesService.showPhrase();
    this.setDate(new Date());
    this.countriesList();
  }

  setDate(date: Date) {
    this.currentDate = format(date, `dd 'de' MMMM`, { locale: es });
  }

  countriesList() {
    this.countries = [
      {
        name: 'España',
        flag: '/assets/imgs/flags/spain_round_icon_64.png',
        time: format(this.timeToOtherTimeZone('Europe/Madrid'), this.formatToShow),
        timeZone: 'Europe/Madrid'
      },
      {
        name: 'Chile',
        flag: '/assets/imgs/flags/chile_round_icon_64.png',
        time: format(this.timeToOtherTimeZone('America/Santiago'), this.formatToShow),
        timeZone: 'America/Santiago'
      },
      {
        name: 'Mexico',
        flag: '/assets/imgs/flags/mexico_round_icon_64.png',
        time: format(this.timeToOtherTimeZone('America/Mexico_City'), this.formatToShow),
        timeZone: 'America/Mexico_City'
      },
    ];
    this.orderCountries();
  }

  timeToOtherTimeZone(timeZone: string, locale = 'en-US'): Date {
    return new Date(new Date(this.currentTimeNumber).toLocaleString(locale, { timeZone }));
  }

  orderCountries() {
    this.countries.sort((obj1, obj2) => {
      if (obj1.name > obj2.name) {
        return 1;
      }
      if (obj1.name < obj2.name) {
        return -1;
      }
      return 0;
    });
    this.changeDetectorRef.markForCheck();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.init();
      event.target.complete();
    }, 1000);
  }

}
