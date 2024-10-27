import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://moviebaseapi-a2aa3807c6ad.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  constructor(private http: HttpClient) {}

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }
  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    const username = userDetails.Username;
    const password = userDetails.Password;
  
    const loginUrl = `${apiUrl}login?Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`;
  
    return this.http.post(loginUrl, {}).pipe(
      catchError(this.handleError)
    );
  }
  

  // Get all movies method
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

// Get movie by title
public getOneMovie(title: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(`${apiUrl}movies/${encodeURIComponent(title)}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Get director description
public getDirector(director: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(`${apiUrl}movies/director/${encodeURIComponent(director)}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}


// Get genre description
public getGenre(genre: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(`${apiUrl}movies/genre/${encodeURIComponent(genre)}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}


// Get user information
public getUser(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  const username = userDetails.Username;
  return this.http.get(`${apiUrl}users/${username}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Get favorite movies of user
public getFavoriteMovies(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  const username = userDetails.Username;
  return this.http.get(`${apiUrl}users/${username}/movies`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Add movie to user favorites
public addFavoriteMovie(userDetails: any, movieID: string): Observable<any> {
  const token = localStorage.getItem('token');
  const username = userDetails.Username;
  return this.http.post(`${apiUrl}users/${username}/movies/${movieID}`, {}, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Update user information
public updateUser(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  const username = userDetails.Username;
  return this.http.put(`${apiUrl}users/${username}`, userDetails, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Delete user account
public deleteUser(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  const username = userDetails.Username;
  return this.http.delete(`${apiUrl}users/${username}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Remove movie from user favorites
public removeFavoriteMovie(userDetails: any, movieID: string): Observable<any> {
  const token = localStorage.getItem('token');
  const username = userDetails.Username;
  return this.http.delete(`${apiUrl}users/${username}/movies/${movieID}`, {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + token
    })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    return res || {};
  }

  // Error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('Some error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code.
      console.error(`Error Status code ${error.status}, Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}