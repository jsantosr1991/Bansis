import { Component } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [NavComponent,MainComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
