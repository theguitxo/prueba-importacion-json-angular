import { Component, Input, OnInit } from '@angular/core';
import { IconService } from '../icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { v4 as uuidv4 } from 'uuid';
import { AutoDestroy } from '../utils';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'icon-component',
  templateUrl: 'icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @AutoDestroy destroy$: Subject<void> = new Subject<void>();
  @Input() icon!: string;

  iconData!: SafeHtml;
  requestId!: string;

  constructor(
    private readonly iconService: IconService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.requestId = uuidv4();

    this.iconService.getIconData().pipe(takeUntil(this.destroy$)).subscribe(info => {
      if (info.requestId === this.requestId) {
        this.iconData = this.sanitizer.bypassSecurityTrustHtml(info.data);
      }
    });

    this.iconService.getIcon(this.icon, this.requestId);
  }
}
