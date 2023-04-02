import { Component } from '@angular/core';
import { IconService } from './icon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showIcons = false;
  showCollections = false;
  collectionsIds: string[] = [];

  constructor(
    private readonly iconService: IconService
  ) {}

  showIconsComponents(): void {
    this.showIcons = true;
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
}
