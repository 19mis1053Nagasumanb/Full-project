import { Component, OnInit } from '@angular/core';
import { TaskEntity } from '../Interfaces/task-entity.model';
import { EntryService } from '../entry.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit {
  entry: TaskEntity = {
    id:1,
    date: '',
    dayOfWeek: '',
    time: '',
    name: '',
    status: '',
    task: '',
    logHours: ''
  };

  names: string[] = ['Chay', 'Nithin', 'Pradeep', 'Souji', 'Sathvika P', 'Shivu'];
  newName: string = '';
  addingNew: boolean = false;

  successMessageVisible: boolean = false;


  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.initializeForm();
    this.loadNames();
  }

  
  loadNames() {
    this.entryService.getNames().subscribe(
      (response: string[]) => {
        this.names = response;
      },
      (error: any) => {
        console.error('Error fetching names', error);
      }
    );
  }

  initializeForm() {
    const now = new Date();
    this.entry = {
      id:-1,
      date: now.toISOString().split('T')[0],
      dayOfWeek: now.toLocaleString('en-us', { weekday: 'long' }),
      time: now.toTimeString().split(' ')[0],
      name: '',
      status: '',
      task: '',
      logHours: ''
    };
  }

  

  onNameChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    this.addingNew = selectedName === 'addNew';
  }
  

  addNewName() {
    if (this.newName && !this.names.includes(this.newName)) {
      this.entryService.addName(this.newName).subscribe(
        () => {
          this.names.push(this.newName);
          this.entry.name = this.newName;
          this.newName = '';
          this.addingNew = false;
        },
        (error) => {
          console.error('Error adding new name', error);
        }
      );
    }
  }
  

  onSubmit() {
    this.entryService.addEntry(this.entry).subscribe(
      (response: any) => {
        console.log('Entry added successfully', response);
        this.initializeForm(); 

        this.successMessageVisible = true;

        setTimeout(() => {
          this.successMessageVisible = false;
        }, 3000);


      },
      (error: any) => {
        console.error('Error adding entry', error);
      }
    );
  }
}
