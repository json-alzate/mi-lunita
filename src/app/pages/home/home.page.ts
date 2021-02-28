import { Component } from '@angular/core';

import { format } from 'date-fns';


import { Country } from '@models/country.model';

import { PhrasesService } from '@services/phrases.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  phrase: string;
  countries: Country[] = [];

  formatToShow = 'hh:mm aaaa';
  currentTimeNumber = new Date().getTime();
  currentTime = format(new Date(), this.formatToShow);

  constructor(
    private phrasesService: PhrasesService
  ) {
    this.phrase = this.phrasesService.showPhrase();
    this.countriesList();
    // console.log('pagina ', this.phrase);
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

  }

  timeToOtherTimeZone(timeZone: string, locale = 'en-US'): Date {
    return new Date(new Date(this.currentTimeNumber).toLocaleString(locale, { timeZone }));
  }

}
