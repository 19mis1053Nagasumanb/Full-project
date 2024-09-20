import { Component, OnInit } from '@angular/core';
import { Entry } from '../Interfaces/entry';
import { EntryService } from '../entry.service';
import { TaskEntity } from '../Interfaces/task-entity.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {
  entries: Entry[] = [];
  filteredEntries: Entry[] = [];
  paginatedEntries: Entry[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  searchName = '';
  searchDate = '';
  searchStatus = '';

  isEditModalVisible = false;
  selectedEntry: TaskEntity | null = null;

  editingEntryId: number | null = null;  


  successMessageVisible = false;  
  statusOptions: string[] = ['On Hold', 'Completed', 'Pending', 'In Progress'];  


  defaultTaskEntity: TaskEntity = {
    id: 0,
    date: '',
    dayOfWeek: '',
    time: '',
    name: '',
    status: '',
    task: '',
    logHours: ''
  };

  constructor(private entryService: EntryService) {}

  

  ngOnInit(): void {
    this.loadEntries();
  }

  

  loadEntries(): void {
    this.entryService.getEntries().subscribe(
      (data: Entry[]) => {
        this.entries = data.sort((a, b) => b.id - a.id); 
  
        this.filteredEntries = [...this.entries];  
        this.calculateTotalPages();
        this.updatePaginatedEntries();
        console.log('Entries loaded and sorted:', this.entries);
      },
      (error: any) => {
        console.error('Error fetching entries:', error);
      }
    );
  }
  
  startEditing(entry: Entry): void {
    this.editingEntryId = entry.id;
  }

  cancelEditing(): void {
    this.editingEntryId = null;
  }

  saveStatus(entry: Entry): void {
    this.entryService.updateEntry(entry.id, entry).subscribe(
      () => {
        this.successMessageVisible = true;
        setTimeout(() => {
          this.successMessageVisible = false;
        }, 3000);
        this.cancelEditing();
        this.applyFiltersAndPagination();
      },
      (error: any) => {
        console.error('Error updating entry status:', error);
      }
    );
  }

  openEditModal(entry: TaskEntity): void {
    this.selectedEntry = entry; 

    this.isEditModalVisible = true;

    document.querySelector('.form-container')?.classList.remove('hidden');
    document.querySelector('.overlay')?.classList.remove('hidden');
    document.querySelector('.entry-list')?.classList.add('modal-active');
  }

  

  filterEntriesName(): void {
    this.filteredEntries = this.entries.filter(entry =>
      (this.searchName ? entry.name.toLowerCase().includes(this.searchName.toLowerCase()) : true) 
    );
    this.calculateTotalPages();
    this.currentPage = 1; 
    this.updatePaginatedEntries();
  }
  filterEntriesDate(): void {
    this.filteredEntries = this.entries.filter(entry =>
      (this.searchDate ? entry.date.includes(this.searchDate) : true)
    );
    this.calculateTotalPages();
    this.currentPage = 1; 
    this.updatePaginatedEntries();
  }
  filterEntriesStatus(): void {
    this.filteredEntries = this.entries.filter(entry =>
      (this.searchStatus ? entry.status.toLowerCase().includes(this.searchStatus.toLowerCase()) : true)
    );
    this.calculateTotalPages();
    this.currentPage = 1; 
    this.updatePaginatedEntries();
  }
  clearFilter(type: string): void {
    if (type === 'name') {
      this.searchName = '';
    } else if (type === 'status') {
      this.searchStatus = '';
    }
    this.filterEntriesName();
    this.filterEntriesDate();
    this.filterEntriesStatus();

  }
  

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredEntries.length / this.itemsPerPage);
  }

  updatePaginatedEntries(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEntries = this.filteredEntries.slice(startIndex, endIndex);
    console.log('Paginated Entries:', this.paginatedEntries);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedEntries();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEntries();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEntries();
    }
  }

  deleteEntry(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.entryService.deleteEntry(id).subscribe(
        () => {
          this.entries = this.entries.filter(entry => entry.id !== id);
          this.filterEntriesName(); 
        },
        (error: any) => {
          console.error('Error deleting entry:', error);
        }
      );
    }
  }

  

  updateStatus(entry: Entry): void {
    this.entryService.updateEntry(entry.id, entry).subscribe(
      (data: Entry) => {
        this.successMessageVisible = true;
        setTimeout(() => {
          this.successMessageVisible = false;
        }, 3000);
      },
      (error: any) => {
        console.error('Error updating status:', error);
      }
    );
  }
  
  
  saveEntry(updatedEntry: TaskEntity): void {
    if (this.selectedEntry) {
      this.entryService.updateEntry(this.selectedEntry.id, updatedEntry).subscribe(
        (data: TaskEntity) => {
          const index = this.entries.findIndex(entry => entry.id === data.id);
          if (index !== -1) {
            console.log("Old entry found, removing:", this.entries[index]);

            this.entries.splice(index, 1);  
            console.log("Updated entry, adding to top:", data);

            this.entries.unshift(data); 
          }
          this.applyFiltersAndPagination();
          this.currentPage = 1;  
          this.isEditModalVisible = false;  

          this.successMessageVisible = true;
          setTimeout(() => {
            this.successMessageVisible = false;
          }, 3000);

        },
        (error: any) => {
          console.error('Error updating entry:', error);
        }
      );
    } else {
      this.entryService.addEntry(updatedEntry).subscribe(
        (data: TaskEntity) => {
          console.log("New entry added, adding to top:", data); 

          this.entries.unshift(data);       
          this.applyFiltersAndPagination();
          this.currentPage = 1; 
          this.isEditModalVisible = false;  
        },
        (error: any) => {
          console.error('Error adding entry:', error);
        }
      );
    }
  }
  
  
  applyFiltersAndPagination(): void {
    this.filteredEntries = this.entries.slice(); 
    this.filterEntriesName();
    this.filterEntriesDate();
    this.filterEntriesStatus();
    
    this.calculateTotalPages();
    this.updatePaginatedEntries();
  }
  
  
  
  
}
