import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to detect the device's screen width.
 * Adjusts material grid columns accordingly to create a responsive layout.
 * @class FetchApiDataService
 */
export class ResponsiveColumnsService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  // Observable for columns based on screen size
  getColumns(): Observable<number> {
    return this.breakpointObserver.observe([
      '(min-width: 1200px)',  // Large screens
      '(min-width: 768px) and (max-width: 1199px)',  // Medium screens
      '(max-width: 767px)'  // Small screens
    ]).pipe(
      map((state: BreakpointState) => {
        if (state.breakpoints['(min-width: 1200px)']) {
          return 5; // 5 columns for large screens
        } else if (state.breakpoints['(min-width: 768px) and (max-width: 1199px)']) {
          return 3; // 3 columns for medium screens
        } else {
          return 1; // 1 column for small screens
        }
      })
    );
  }
}
