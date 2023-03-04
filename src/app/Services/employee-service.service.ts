import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../Model/Employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  baseurl=  'http://localhost:3000/posts'

  constructor(private http:HttpClient) { }

  getEmployees()
  {
    return this.http.get<Employee[]>(this.baseurl);
  }

  postEmployee(employee:Employee)
  {
    return this.http.post<Employee>(this.baseurl,employee)
  }

  deleteEmployee(id:string)
  {
    return this.http.delete(this.baseurl+'/'+id);
  }
}
