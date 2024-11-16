import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

// Declaring the API URL
const apiUrl = 'https://moviebaseapi-a2aa3807c6ad.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to interact with the API.
 * Provides methods for user registration, login, fetching movies, and managing user data.
 * @class FetchApiDataService
 */
export class FetchApiDataService {
  /**
   * Injects the HttpClient module.
   * @param {HttpClient} http - Angular's HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param {any} userDetails - Object containing user registration details.
   * @returns {Observable<any>} Observable with the response from the API.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Logs in a user.
   * @param {any} userDetails - Object containing username and password.
   * @returns {Observable<any>} Observable with the response from the API.
   */
  public userLogin(userDetails: any): Observable<any> {
    const username = userDetails.Username;
    const password = userDetails.Password;
    const loginUrl = `${apiUrl}login?Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`;

    return this.http.post(loginUrl, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetches all movies from the API.
   * @returns {Observable<any>} Observable with an array of movie data.
   */
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

  /**
   * Fetches details of a specific movie by its title.
   * @param {string} title - The title of the movie.
   * @returns {Observable<any>} Observable with movie details.
   */
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

  /**
   * Fetches details of a director.
   * @param {string} director - The name of the director.
   * @returns {Observable<any>} Observable with director details.
   */
  public getDirector(director: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}movies/directors/${encodeURIComponent(director)}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches details of a genre.
   * @param {string} genre - The name of the genre.
   * @returns {Observable<any>} Observable with genre details.
   */
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

  /**
   * Fetches user information.
   * @param {any} userDetails - Object containing username.
   * @returns {Observable<any>} Observable with user details.
   */
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

  /**
   * Fetches favorite movies of the user.
   * @param {any} userDetails - Object containing username.
   * @returns {Observable<any>} Observable with user's favorite movies.
   */
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

  /**
   * Adds a movie to the user's favorites.
   * @param {any} userDetails - Object containing username.
   * @param {string} movieID - The ID of the movie.
   * @returns {Observable<any>} Observable with the response from the API.
   */
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

  /**
   * Updates user information.
   * @param {any} userDetails - Object containing new user details.
   * @returns {Observable<any>} Observable with the response from the API.
   */
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

  /**
   * Deletes the user account.
   * @param {any} userDetails - Object containing username.
   * @returns {Observable<any>} Observable with the response message.
   */
  public deleteUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = userDetails.Username;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${apiUrl}users/${username}`, { headers, responseType: 'text' }).pipe(
      map(response => {
        // The response will be a plain text message
        return { message: response }; // or simply return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from the user's favorites.
   * @param {any} userDetails - Object containing username.
   * @param {string} movieID - The ID of the movie.
   * @returns {Observable<any>} Observable with the response from the API.
   */
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

  /**
   * Extracts response data.
   * @private
   * @param {any} res - The response object.
   * @returns {any} The extracted response data or an empty object.
   */
  private extractResponseData(res: any): any {
    return res ? res : {};  // Return empty object if no data
  }

  /**
   * Handles HTTP errors.
   * @private
   * @param {HttpErrorResponse} error - The error response object.
   * @returns {Observable<never>} Throws an error observable with a custom message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
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
