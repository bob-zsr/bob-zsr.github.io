import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BossrushModule } from './bossrush';
import { BossrushComponent } from './bossrush/bossrush.component';
import { SkywardSwordModule } from './skywardsword/skywardsword.module';

const routes: Routes = [
  {
    path: 'bossrush', component: BossrushComponent
  },
  {
    path: '', redirectTo: 'bossrush', pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BossrushModule,
    SkywardSwordModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
