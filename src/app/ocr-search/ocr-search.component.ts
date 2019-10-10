import { Component, OnInit } from '@angular/core';
import { ElasticsearchService } from '../elasticsearch.service';
import axios from 'axios';

interface Employee {
  name: string;
  empId: string;
  url: string;
  content: string;
}

export interface EmployeeSource {
  source: Employee;
}

@Component({
  selector: 'app-ocr-search',
  templateUrl: './ocr-search.component.html',
  styleUrls: ['./ocr-search.component.css']
})
export class OcrSearchComponent implements OnInit {

  private static readonly INDEX = 'thz_indexv1';
  private static readonly TYPE = '_doc';
  idDetail: string = "";

  headElements: string[] = ['#','Property', 'Value']
  
  employees: EmployeeSource[];
  finalArr: String[][] = [];

  private queryText = '';
 
  private lastKeypress = 0;
 
  constructor(private es: ElasticsearchService) {
    this.queryText = '';
  }

  ngOnInit() {
  }

  search(event) {
    this.idDetail = event.target.value
    // if ($event.timeStamp - this.lastKeypress > 100) {
    //   this.queryText = $event.target.value;
 
    //   this.es.fullTextSearch(
    //     OcrSearchComponent.INDEX,
    //     OcrSearchComponent.TYPE,
    //     'content', this.queryText).then(
    //       response => {
    //         this.employees = response.hits.hits;
            
    //         console.log('MMMMM',this.employees);
    //       }, error => {
    //         console.error(error);
    //       }).then(() => {
    //         console.log('Search Completed!');
    //       });
    // }
 
    // this.lastKeypress = $event.timeStamp;
  }

  async downloadObject(objUrl){
    let name = objUrl.split("/").pop()
    const uploadUrl = await axios.post('https://d7vgjq4jy3.execute-api.us-east-1.amazonaws.com/dev/preurl',{
      fileName: name,
      name: "getRequest",
      empId: "dummy"

    })
    let finalUrl= uploadUrl['data']['body']['url'];
    var win = window.open(finalUrl, '_blank');
    win.focus();
  }

  async onSubmit(){
 
      this.es.fullTextSearchContent(
        OcrSearchComponent.INDEX,
        OcrSearchComponent.TYPE,
        'empId', this.idDetail).then(
          response => {
            this.employees = response.hits.hits;

            let y = JSON.parse(this.employees[0]['_source']['content'])
            console.log('YYYYYYYYY', y)
            this.finalArr = Object.keys(y).map(function(key) {
              return [key, y[key]];
            });
            console.log('FinalArray is ',this.finalArr);
          }, error => {
            console.error(error);
          }).then(() => {
            console.log('Search Completed!');
          });
  }

}
