import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';

import { Storage } from '@ionic/storage';


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

  @ViewChild('dateTimeField') dateTimeField;

  phrase: string;
  countries: Country[] = [];
  copyCountries: Country[] = [];
  savedCountries: Country[] = [];

  formatToShow = 'hh:mm aaaa';
  currentTimeNumber;
  currentTime;
  currentDate;
  currentCountry = 'tu ubicación';

  pickerDateTime: string;
  textForSearch = '';

  constructor(
    private storage: Storage,
    private phrasesService: PhrasesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.setDate(new Date());
    fetch('https://extreme-ip-lookup.com/json/')
      .then(res => res.json())
      .then(response => {
        this.currentCountry = response.country;
      });
  }

  setDate(date: Date) {
    this.currentDate = format(date, `dd 'de' MMMM`, { locale: es });
    this.init(date);
  }


  init(date: Date) {
    this.currentTimeNumber = date.getTime();
    this.currentTime = format(date, this.formatToShow);
    this.phrase = this.phrasesService.showPhrase();
    this.getSavedCountries();
  }


  getSavedCountries() {
    this.storage.get('savedCountries').then(data => {
      if (data) {
        this.savedCountries = JSON.parse(data) as Country[];
      }
      this.countriesList();
    }).catch(() => this.countriesList());

  }


  countriesList() {
    this.countries = [
      {
        name: 'España',
        flag: '/assets/imgs/flags/spain_round_icon_64.png',
        time: format(this.timeToOtherTimeZone('Europe/Madrid'), this.formatToShow),
        timeZone: 'Europe/Madrid',
        saved: this.savedCountries.find(country => country.name === 'España') ? true : false
      },
      {
        name: 'Chile',
        flag: '/assets/imgs/flags/chile_round_icon_64.png',
        time: format(this.timeToOtherTimeZone('America/Santiago'), this.formatToShow),
        timeZone: 'America/Santiago',
        saved: this.savedCountries.find(country => country.name === 'Chile') ? true : false
      },
      {
        name: 'Mexico',
        flag: '/assets/imgs/flags/mexico_round_icon_64.png',
        time: format(this.timeToOtherTimeZone('America/Mexico_City'), this.formatToShow),
        timeZone: 'America/Mexico_City',
        saved: this.savedCountries.find(country => country.name === 'Mexico') ? true : false
      },
    ];
    this.copyCountries = this.countries;
    this.orderCountries();
  }


  timeToOtherTimeZone(timeZone: string, locale = 'en-US'): Date {
    return new Date(new Date(this.currentTimeNumber).toLocaleString(locale, { timeZone }));
  }

  saveCountry(country: Country) {
    this.storage.get('savedCountries').then(data => {
      let savedCountries: Country[] = JSON.parse(data) as Country[];
      if (savedCountries) {
        savedCountries.push(country);
      } else {
        savedCountries = [country];
      }

      this.storage.set('savedCountries', JSON.stringify(savedCountries)).then(() => this.getSavedCountries());
    });
  }

  unSave(country: Country) {
    this.storage.get('savedCountries').then(data => {
      let savedCountries: Country[] = JSON.parse(data) as Country[];
      savedCountries = savedCountries.filter(countryItem => countryItem.name !== country.name);
      this.storage.set('savedCountries', JSON.stringify(savedCountries)).then(() => this.getSavedCountries());
    });
  }



  orderCountries() {
    const toShort = this.countries;
    toShort.sort((obj1, obj2) => {
      if (obj1.name > obj2.name) {
        return 1;
      }
      if (obj1.name < obj2.name) {
        return -1;
      }
      return 0;
    });
    this.countries = toShort;
    this.copyCountries = toShort;
    this.changeDetectorRef.markForCheck();
  }


  onSearch(event) {
    if (this.textForSearch !== '') {
      this.countries = this.countries.filter(country => country.name.toLowerCase().includes(this.textForSearch.toLowerCase()));
    } else {
      this.countries = this.copyCountries;
    }
    this.changeDetectorRef.markForCheck();
  }


  openDateTimePicker() {
    this.dateTimeField.open();
  }


  onChangePicker(event) {
    const convertDate = new Date(this.pickerDateTime.split('T').join(' '));
    this.setDate(convertDate);
  }


  doRefresh(event) {
    setTimeout(() => {
      this.init(new Date());
      event.target.complete();
    }, 1000);
  }

}
