import { Component} from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {

  files: any = [];

  name: string;
  uid: string;
  filePath: string;
  fileType: string;
  fileContent: object[] = [];
  isComplete: boolean = false;

  saveId(event){
    console.log(event.target.value)
    this.uid = event.target.value
  }

  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      console.log('MMMMM event', element);
      this.files.push(element.name)
      this.fileContent.push(element);
    }  
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  async onSubmit(){
    this.isComplete = false;
    const uploadUrl = await axios.post('https://d7vgjq4jy3.execute-api.us-east-1.amazonaws.com/dev/preurl',{
      fileName: this.files[0],
      name: 'OCR',
      empId: this.uid

    })
    try {
    let res = await axios.put(uploadUrl.data["body"]["url"],this.fileContent[0], {
      headers: {
        'Content-Type' : this.fileContent[0]["type"],
        // "x-amz-tagging": "myrealtag=tagvalue"
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