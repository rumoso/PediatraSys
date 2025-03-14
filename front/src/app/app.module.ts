import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { ComponentsModule } from './components/components.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { DatePipe } from '@angular/common'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,

    HttpClientModule,
    ComponentsModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-MX'},
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
