import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FiComponent, ScrollComponent, SwitchComponent, FormControlComponent } from '.';

@NgModule({
    exports: [
        ScrollComponent,
        FiComponent,
        SwitchComponent,
        FormControlComponent
    ],
    declarations: [
        ScrollComponent,
        FiComponent,
        SwitchComponent,
        FormControlComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule
    ]
})
export class SkywardSwordModule { }
