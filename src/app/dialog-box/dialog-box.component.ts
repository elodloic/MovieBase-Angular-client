import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
})
export class DialogBoxComponent {
  dataContent: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: string; value: string },
    private fetchApiData: FetchApiDataService,
    private dialogRef: MatDialogRef<DialogBoxComponent>
  ) {
    this.loadData(data.type, data.value);
  }

  loadData(type: string, value: string): void {
    switch (type) {
      case 'genre':
        this.fetchApiData.getGenre(value).subscribe((resp: any) => {
          this.dataContent = resp;
        });
        break;
      case 'director':
        this.fetchApiData.getDirector(value).subscribe((resp: any) => {
          this.dataContent = resp;
        });
        break;
      case 'movie':
        this.fetchApiData.getOneMovie(value).subscribe((resp: any) => {
          this.dataContent = resp;
        });
        break;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
