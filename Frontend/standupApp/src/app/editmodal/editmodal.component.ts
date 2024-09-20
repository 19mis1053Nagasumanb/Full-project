import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskEntity } from '../Interfaces/task-entity.model';
import { EntryService } from '../entry.service';

@Component({
  selector: 'app-editmodal',
  templateUrl: './editmodal.component.html',
  styleUrls: ['./editmodal.component.scss']

})
export class EditmodalComponent implements OnInit {
  @Input() entry!: TaskEntity; 
  @Input() showModal: boolean = false; 
  isEditing: boolean = false; 

  @Output() save = new EventEmitter<TaskEntity>(); 
  originalEntry!: TaskEntity;

  names: string[] = []; 
  addingNew: boolean = false;
  newName: string = '';
  isEditModalVisible: boolean = false;

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.loadNames(); 

    this.originalEntry = { ...this.entry };

  }

  loadNames(): void {
    this.entryService.getEntries().subscribe((names: string[]) => this.names = names);
  }
  
  
  closeModal(): void {

    
    this.entry.date = this.originalEntry.date;
    this.entry.dayOfWeek = this.originalEntry.dayOfWeek;
    this.entry.time = this.originalEntry.time;

    this.isEditModalVisible = false;
    document.querySelector('.form-container')?.classList.add('hidden');
    document.querySelector('.overlay')?.classList.add('hidden');
    document.querySelector('.entry-list')?.classList.remove('modal-active');
  }
  
  

  saveChanges():void {
    this.save.emit(this.entry);
    this.closeModal();

    if (this.entry.id !== undefined) {
      this.entryService.updateEntry(this.entry.id, this.entry).subscribe(
        (response: any) => {
          console.log('Entry updated successfully', response);
        },
        (error: any) => {
          console.error('Error updating entry', error);
        }
      );
    } else {
      console.error('Entry ID is undefined');
    }
  }
}
