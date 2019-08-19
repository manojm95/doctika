import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor() { }

  name: string;
  empId: string;
  filePath: string;
  fileType: string;
  fileContent: object;
  isComplete: boolean = false;

  ngOnInit() {
  }

  saveName(event){
    console.log(event.target.value)
    this.name = event.target.value
  }

  saveId(event){
    console.log(event.target.value)
    this.empId = event.target.value
  }

  saveFileName(event) {
    console.log('MMMMMM')
    console.log('The vale is ', event.target.files[0]);
    this.filePath = event.target.files[0].name;
    this.fileType = event.target.files[0].type;
    this.fileContent = event.target.files[0];
  }

  async onSubmit(){
    console.log("The recorded values are ",this.name + "  " + this.empId + " " + this.filePath + " " + this.fileType )
    console.log("nnnnnnnn", this.fileContent["type"])
    this.isComplete = false;
    const uploadUrl = await axios.post('https://mmmmm',{
      fileName: this.fileContent["name"],
      name: this.name,
      empId: this.empId

    })
    try {
    let res = await axios.put(uploadUrl.data["body"]["url"],this.fileContent, {
      headers: {
        'Content-Type' : this.fileContent["type"],
        "x-amz-tagging": "myrealtag=tagvalue"
      }
    })
    this.isComplete = true;
  }
  catch(err){
    console.log("The error is ", err);
  }
    console.log('MMMM resp is ', uploadUrl.data["body"]["url"]);
  }

}
