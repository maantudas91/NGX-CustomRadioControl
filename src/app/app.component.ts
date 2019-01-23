import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  form : FormGroup;

  items : Array<any> = [
      { id : 123, name : 'Male', value: 'male'},
      { id : 130, name : 'Female', value: 'female'}
  ]
  constructor(private fb: FormBuilder){}

  ngOnInit(){
  	this.form = this.fb.group({
  		name : ['', [Validators.required]],
  		email : ['', [Validators.required, Validators.email]],
  		level: ['low', [Validators.required]]
  	});
  }


  change($event){
    console.log($event)
  }

  submit(form : NgForm){
    console.log(form.value);
  }
}
