
import { Component, AfterViewInit } from '@angular/core';
import {RouterLink} from '@angular/router';
declare var particlesJS: any;

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})

export class NotFoundComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    particlesJS.load('particles-js', '/assets/vendor/particles/particles-config.json');
  }
}
