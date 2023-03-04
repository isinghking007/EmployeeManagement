import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Employee } from 'src/app/Model/Employee.model';
import { EmployeeServiceService } from 'src/app/Services/employee-service.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  @ViewChild('fileinput',{static:true}) fileInput:any;
  @ViewChild('addEmployeeButton') addEmployeeButton: any;
  @ViewChild('searchInput') searchInputValue:any;
  educationOptions=[
    '10th Passed',
    '12th Passed',
    'Graduation',
    'Post Graduation'
  ];

  employeeForm:FormGroup;
  employees:Employee[];
  employeesToDisplay:Employee[];
  constructor(private fb:FormBuilder,private service:EmployeeServiceService) {
    this.employeeForm=fb.group({});
    this.employees=[];
    this.employeesToDisplay=this.employees;
   }

  ngOnInit(): void {
    this.employeeForm=this.fb.group({
      firstname:this.fb.control(''),
      lastname:this.fb.control(''),
      birthdate:this.fb.control(''),
      gender:this.fb.control(''),
      education:this.fb.control('default'),
      company:this.fb.control(''),
      jobExperience:this.fb.control(''),
      salary:this.fb.control(''),
    });

    this.service.getEmployees().subscribe(res => {
      for(let r of res)
      {
        this.employees.unshift(r);
      }
      this.employeesToDisplay=this.employees;
    } );
    // console.log(this.addEmployee());
  }


  //#region FormControls
  public  get FirstName():FormControl{
    return this.employeeForm.get('firstname') as FormControl
  }
  public  get LastName():FormControl{
    return this.employeeForm.get('lastname') as FormControl
  }
    public  get BirthDate():FormControl{
    return this.employeeForm.get('birthdate') as FormControl
  }
  public  get Gender():FormControl{
    return this.employeeForm.get('gender') as FormControl
  }
  public  get Education():FormControl{
    return this.employeeForm.get('education') as FormControl
  }
    public  get Company():FormControl{
    return this.employeeForm.get('company') as FormControl
  }
  public  get Job():FormControl{
    return this.employeeForm.get('jobExperience') as FormControl
  }
  public  get Salary():FormControl{
    return this.employeeForm.get('salary') as FormControl
  }

  //#endregion FormContorls

  setForm(emp:Employee)
  {
    this.FirstName.setValue(emp.firstname);
    this.LastName.setValue(emp.lastname);
    this.BirthDate.setValue(emp.birthdate);
    this.Gender.setValue(emp.gender);

    let educationIndex=0;
    this.educationOptions.forEach((val,index)=>{
      if(val === emp.education)
      {
        educationIndex=index;
      }
    });
    this.Education.setValue(educationIndex);
    
    this.Company.setValue(emp.company);
    this.Job.setValue(emp.jobExperience);
    this.Salary.setValue(emp.salary);
    this.fileInput.nativeElement.value='';
  }

  clearForm(){
    this.FirstName.setValue('');
    this.LastName.setValue('');
    this.BirthDate.setValue('');
    this.Gender.setValue('');
    this.Education.setValue('');
    this.Company.setValue('');
    this.Job.setValue('');
    this.Salary.setValue('');
    this.fileInput.nativeElement.value='';
  }

  addEmployee() {
    let employee: Employee = {
      firstname: this.FirstName.value,
      lastname: this.LastName.value,
      birthdate: this.BirthDate.value,
      gender: this.Gender.value,
      education: this.educationOptions[parseInt(this.Education.value)],
      company: this.Company.value,
      jobExperience: this.Job.value,
      salary: this.Salary.value,
      profile: this.fileInput.nativeElement.files[0]?.name,
    };
    this.service.postEmployee(employee).subscribe((res) => {
      this.employees.unshift(res);
      this.clearForm();
    });
  }
  removeEmployee(event:any)
  {
    this.employees.forEach((val,index)=>{
      if(val.id === parseInt(event))
      {
        this.service.deleteEmployee(event).subscribe((res)=>{
          this.employees.splice(index,1); 
        })
      }
    })
  }
  editEmployee(event:any)
  {
    this.employees.forEach((val,index)=>{
      if(val.id === parseInt(event))
      {
        this.setForm(val);
      }
    });
    this.removeEmployee(event);
    this.addEmployeeButton.nativeElement.click();
  }
  searchEmployees(event:any)
  {
    let filteredData:Employee[]=[];
    if(event === '')
    {
      this.employeesToDisplay=this.employees;
    }
    else{
      filteredData=this.employees.filter((val,index)=>{
        let targetKey=val.firstname.toLowerCase()+''+val.lastname.toLowerCase();
        let searchKey=event.toLowerCase();
        return targetKey.includes(searchKey);
      });
      this.employeesToDisplay=filteredData;
    }
  }
}

