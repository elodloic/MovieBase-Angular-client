import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsiveService } from '../responsive-columns.service'; 

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  cols: number = 5;
  user: any = {};
  favoriteMovieIds: string[] = [];
  favoriteMovies: any[] = [];
  movies: any[] = [];
  isLoadingFavorites = true; // Loading state flag
  isEditing = false;
  isChangingPassword = false;
  newPassword = '';
  confirmPassword = '';

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getMovies();
    this.responsiveService.getColumns().subscribe((cols: number) => {
      this.cols = cols;
    });
  }

  // Fetch user data
  getUser(): void {
    const userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(userDetails).subscribe((resp: any) => {
      this.user = resp;
      this.favoriteMovieIds = resp.FavoriteMovies;
    });
  }

  // Fetch all movies and filter favorites
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;

      // Filter movies to only include favorites
      this.favoriteMovies = this.movies.filter((movie: any) =>
        this.favoriteMovieIds.includes(movie._id)
      );

      // Set loading to false after fetching
      this.isLoadingFavorites = false;
    });
  }

  // Remove a movie from favorites
  removeFromFavorites(movieId: string): void {
    const username = this.user.Username;
    this.fetchApiData.removeFavoriteMovie({ Username: username }, movieId).subscribe((resp: any) => {
      // Remove the movie from the local favoriteMovies array
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
      // Show a confirmation message
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000
      });
    }, (error) => {
      console.error('Error removing movie from favorites', error);
      this.snackBar.open('Failed to remove movie from favorites', 'OK', {
        duration: 2000
      });
    });
  }



  // Enable editing mode
  editProfile(): void {
    this.isEditing = true;
  }

  // Save profile changes
  saveProfile(): void {
    const userDetails = { ...this.user };
    this.fetchApiData.updateUser(userDetails).subscribe(
      (resp: any) => {
        this.snackBar.open('Profile updated successfully', 'OK', { duration: 3000 });
        localStorage.setItem('user', JSON.stringify(resp));
        this.isEditing = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Change password
  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open("Passwords don't match!", 'OK', { duration: 3000 });
      return;
    }
    const updatedUser = { ...this.user, Password: this.newPassword };
    this.fetchApiData.updateUser(updatedUser).subscribe(
      () => {
        this.snackBar.open('Password updated successfully', 'OK', { duration: 3000 });
        this.isChangingPassword = false;
        this.newPassword = '';
        this.confirmPassword = '';
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Delete account
  deleteAccount(): void {
    const userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    if (confirm('Are you sure you want to delete your account?')) {
      this.fetchApiData.deleteUser(userDetails).subscribe(() => {
        localStorage.clear();
        this.router.navigate(['/welcome']);
        this.snackBar.open('Account deleted successfully', 'OK', { duration: 3000 });
      });
    }
  }
}
