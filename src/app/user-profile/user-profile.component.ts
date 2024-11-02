import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];
  movies: any[] = [];
  isEditing = false;
  isChangingPassword = false;
  newPassword = '';
  confirmPassword = '';

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

  // Fetch user data
  getUser(): void {
    const userDetails = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(userDetails).subscribe((resp: any) => {
      this.user = resp;
      this.favoriteMovies = resp.FavoriteMovies;
    });
  }

  // Fetch all movies and filter favorites
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  // Enable editing mode
  editProfile(): void {
    this.isEditing = true;
  }

  // Save profile changes
  saveProfile(): void {
    const userDetails = { ...this.user };  // Ensures user data format matches API structure
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
