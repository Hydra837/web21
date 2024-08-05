import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../Models/User'; // Assurez-vous que ce modèle correspond à votre définition de User

@Component({
  selector: 'app-user-selection-dialog',
  templateUrl: './user-selection-dialog.component.html',
  styleUrls: ['./user-selection-dialog.component.css']
})
export class UserSelectionDialogComponent {
  selectedUserId?: number;

  constructor(
    public dialogRef: MatDialogRef<UserSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { users: User[] }
  ) { }

  selectUser(userId: number): void {
    this.selectedUserId = userId;
  }

  confirmSelection(): void {
    if (this.selectedUserId !== undefined) {
      this.dialogRef.close(this.selectedUserId);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}