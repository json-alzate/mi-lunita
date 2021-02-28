import { Component } from '@angular/core';

import { PhrasesService } from '@services/phrases.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private phrasesService: PhrasesService
  ) {
    document.body.classList.toggle('dark', true);
    this.phrasesService.loadPhrases();
  }
}
