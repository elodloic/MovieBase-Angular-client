import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component'; // Import the dialog component
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];

    constructor(
    public fetchApiData: FetchApiDataService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openGenericDialog(type: string, value: string): void {
    this.dialog.open(DialogBoxComponent, {
      data: { type, value }
    });
  }

  addToFavorites(movieID: string): void {
    const username = JSON.parse(localStorage.getItem('user')!).Username;
    if (username) {
      this.fetchApiData.addFavoriteMovie({ Username: username }, movieID).subscribe((resp: any) => {
        console.log(`${movieID} added to favorites`);
        this.snackBar.open(`${movieID} added to favorites`, 'OK', {
          duration: 2000
       });
      }, (error) => {
        console.error('Error adding to favorites', error);
      });
    } else {
      console.error('User not logged in');
    }
  }
}

