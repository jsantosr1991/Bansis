import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { MainComponent } from './main/main.component';
import { RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule, NavComponent, MainComponent, IndexComponent
  ],
  exports: [IndexComponent]
})
export class IndexModule { }
