import { Component, OnInit } from '@angular/core';
import { ElasticsearchService } from '../elasticsearch.service';

export interface Employee {
  name: string;
  empId: string;
}

export interface EmployeeSource {
  source: Employee;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private static readonly INDEX = 'thz_index';
  private static readonly TYPE = '_doc';
  
  employees: EmployeeSource[];

  private queryText = '';
 
  private lastKeypress = 0;
 
  constructor(private es: ElasticsearchService) {
    this.queryText = '';
  }

  ngOnInit() {
  }

  search($event) {
    if ($event.timeStamp - this.lastKeypress > 100) {
      this.queryText = $event.target.value;
 
      this.es.fullTextSearch(
        SearchComponent.INDEX,
        SearchComponent.TYPE,
        'content', this.queryText).then(
          response => {
            this.employees = response.hits.hits;
            console.log(response);
          }, error => {
            console.error(error);
          }).then(() => {
            console.log('Search Completed!');
          });
    }
 
    this.lastKeypress = $event.timeStamp;
  }

}
