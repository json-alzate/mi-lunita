import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { format } from 'date-fns';

import { Phrase } from '@models/phrase.model';

@Injectable({
  providedIn: 'root'
})
export class PhrasesService {

  public phrases: Phrase[] = [];
  tryTimesShowPhrase = 0;

  constructor(
    private httpClient: HttpClient
  ) {
    this.loadPhrases();
  }


  async loadPhrases() {
    this.phrases = await this.httpClient.get<Phrase[]>('/assets/data/phrases_es.json').toPromise();
  }


  showPhrase(): string {

    if (this.phrases && this.phrases.length > 0) {
      let phraseToReturn;
      const currentDate = format(new Date(), 'MMdd');
      phraseToReturn = this.phrases.find(phrase => phrase.date === currentDate)?.text;
      if (!phraseToReturn) {
        phraseToReturn = this.phrases[Math.floor(Math.random() * this.phrases.length)]?.text;
      }
      return phraseToReturn;
    }

  }

}
