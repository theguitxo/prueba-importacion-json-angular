import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { IconService } from './icon.service';
import { IconComponent } from './icon/icon.component';
import { CollectionComponent } from './collection/collection.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent,
    CollectionComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [IconService],
  bootstrap: [AppComponent]
})
export class AppModule { }
