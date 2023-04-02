import { Component, Input, OnInit } from "@angular/core";
import { IconService } from "../icon.service";

@Component({
  selector: 'collection-component',
  templateUrl: 'collection.component.html'
})
export class CollectionComponent implements OnInit {
  @Input() collection!: string;

  collectionIdList: string[] = [];

  constructor(
    private readonly iconService: IconService
  ) {}

  ngOnInit(): void {
    this.collectionIdList = this.iconService.getCollectionIconsIds(this.collection);
  }
}