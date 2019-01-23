import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR } from '@angular/forms';


const RADIO_BUTTON_VALUE_ACCESSOR: any = {
	provide : NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => RadioButtonGroupComponent),
	multi : true, 
}; 

@Component({
  selector: 'radio-button-group',
  templateUrl: './radio-button-group.component.html',
  styleUrls: ['./radio-button-group.component.scss'],
  providers:[RADIO_BUTTON_VALUE_ACCESSOR]
})
export class RadioButtonGroupComponent implements OnInit, ControlValueAccessor {

	disabled : boolean;
	level : string;
	private onChange: Function; 
	private onTouched: Function;

  constructor() {
  	this.onChange = (_: any) => {};
	this.onTouched = () => {};
	this.disabled = false;
  }

  ngOnInit() {
  }

  setLevel(level:string): void{
  		this.level = level;
  		this.onChange(level);
  		this.onTouched();
  }

  isActive(value){
  	return value == this.level;
  }

  writeValue(obj: any): void{
  	this.level = obj;
  	//this.onChange(this.level);
  }

  registerOnChange(fn:any):void{
  	this.onChange = fn;
  }

  registerOnTouched(fn:any):void{
  	this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
	this.disabled = isDisabled; 
  }

}
