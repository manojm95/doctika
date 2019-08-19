import { Component, OnInit, Input } from '@angular/core';
import { Employee } from '../search/search.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  constructor() { }

  @Input() employee: Employee;

  ngOnInit() {
  }

}
