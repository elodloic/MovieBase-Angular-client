import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MovieBase-Angular-client';
  showToolbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to router events to detect when we're on the /welcome or root (/) route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Hide navbar on /welcome and root (/) routes
      this.showToolbar = event.url !== '/welcome' && event.url !== '/';
    });
  }

  logout(): void {
    // Clear user authentication data
    localStorage.clear();
    // Redirect to welcome page
    this.router.navigate(['/welcome']);
  }
}