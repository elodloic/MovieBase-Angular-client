import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsiveService } from '../responsive-columns.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  cols: number = 5;  //default value, adjusted by responsive columns service
  favoriteMovieIds: string[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.getUserFavorites();
    this.getMovies();
    this.responsiveService.getColumns().subscribe((cols: number) => {
      this.cols = cols;
    });
  }

  // Fetch the user from localStorage and retrieve their favorite movies
  getUserFavorites(): void {
    const userDetails = JSON.parse(localStorage.getItem('user') || '{}');

    // Check if userDetails has the Username property
    if (userDetails && userDetails.Username) {
      this.fetchApiData.getUser(userDetails).subscribe((resp: any) => {
        this.favoriteMovieIds = resp.FavoriteMovies;
      }, (error) => {
        console.error('Error fetching user data:', error);
      });
    } else {
      console.error('No user found in localStorage or Username is missing');
    }
  }

  // Fetch all movies
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  // Check if the movie is in the favorites
  isFavorite(movieId: string): boolean {
    return this.favoriteMovieIds.includes(movieId);
  }

  // Toggle the favorite status of a movie
  toggleFavorite(movieId: string): void {
    const userDetails = JSON.parse(localStorage.getItem('user') || '{}');

    if (userDetails && userDetails.Username) {
      if (this.isFavorite(movieId)) {
        // Remove from favorites
        this.fetchApiData.removeFavoriteMovie(userDetails, movieId).subscribe((resp: any) => {
          this.favoriteMovieIds = this.favoriteMovieIds.filter(id => id !== movieId);
          this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
        });
      } else {
        // Add to favorites
        this.fetchApiData.addFavoriteMovie(userDetails, movieId).subscribe((resp: any) => {
          this.favoriteMovieIds.push(movieId);
          this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
        });
      }
    } else {
      console.error('No user found in localStorage or Username is missing');
    }
  }

  openGenericDialog(type: string, value: string): void {
    this.dialog.open(DialogBoxComponent, {
      data: { type, value }
    });
  }
}
