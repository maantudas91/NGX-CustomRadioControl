import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RadioControlComponent, SELECTION_MODEL_FACTORY } from './components/radio-control/radio-control.component';
import { DefaultSelectionModelFactory } from './components/radio-control/selection-model';
import { RadioButtonGroupComponent } from './components/radio-button-group/radio-button-group.component';

@NgModule({
  declarations: [
    AppComponent,
    RadioControlComponent,
    RadioButtonGroupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }