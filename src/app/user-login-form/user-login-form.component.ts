import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
/**
 * Login form component
 * Contains the login function and stores the user and token in local storage.
 * @class UserLoginFormComponent
 */
export class UserLoginFormComponent implements OnInit {

  @Input() loginData = { Username: '', Password: '' };

constructor(
    public FetchApiDataService: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router) { }
ngOnInit(): void {
}

// Function responsible for sending the form inputs to the backend
loginUser(): void {
    this.FetchApiDataService.userLogin(this.loginData).subscribe((result) => {
      localStorage.setItem("user", JSON.stringify(result.user));  // Storing the user in the local storage
      localStorage.setItem("token", result.token);                // Storing the token in the local storage
      this.dialogRef.close();                                     // This will close the modal on success!
      this.snackBar.open("Login successful", 'OK', {
        duration: 2000
     });
     this.router.navigate(['movies']);
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  }