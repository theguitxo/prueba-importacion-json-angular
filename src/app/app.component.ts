import { Component } from '@angular/core';
import { IconService } from './icon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showIcons = false;
  btnShowIconsText = 'Show Icons';
  showCollections = false;
  collectionsIds: string[] = [];

  constructor(
    private readonly iconService: IconService
  ) {}

  showIconsComponents(): void {
    this.showIcons = !this.showIcons;
    this.btnShowIconsText = this.showIcons ? 'Hide Icons' : 'Show Icons';
  }

  showCollectionComponent(): void {
    this.collectionsIds = this.iconService.getAllIdCollections();
    this.showCollections = true;
  }

  loadAllCollections(): void {
    this.iconService.getLoadAllCollections().subscribe(data => {
      this.showCollectionComponent();
    });
    this.iconService.loadCollections();
  }

  showDispatchQueue(): void {
    console.log(this.iconService.iconRequests);
  }
}
