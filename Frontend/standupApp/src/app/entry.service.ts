import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskEntity } from './Interfaces/task-entity.model';
import { Entry } from './Interfaces/entry';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiUrl = 'http://localhost:8099/api/task'; 

  constructor(private http: HttpClient) {}

getEntries(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}
getNames(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/names`);
}

addEntry(entry: any): Observable<TaskEntity> {
  return this.http.post<TaskEntity>(`${this.apiUrl}/entry`, entry);
}

updateEntry(id: number, entry: Entry): Observable<Entry> {
  return this.http.put<Entry>(`${this.apiUrl}/entry/${id}`, entry);
}

addName(name: string): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/name`, name);
}


deleteEntry(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}
