import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { IconService } from './icon.service';
import { IconComponent } from './icon/icon.component';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [IconService],
  bootstrap: [AppComponent]
})
export class AppModule { }
