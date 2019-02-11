import { Component, OnInit, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ItemFormControlComponent } from '../item-form-control/item-form-control.component';

@Component({
  selector: 'items-array',
  templateUrl: './items-form-array.component.html',
  styleUrls: ['./items-form-array.component.scss']
})
export class ItemsFormArrayComponent implements OnInit {

  @Input()
  public itemsFormArray: FormArray;

  constructor() { }

  ngOnInit() {
    console.log(this.itemsFormArray)
  }

  addItem() {
    this.itemsFormArray.push(ItemFormControlComponent.buildItem(''))
  }


  static buildItems() {
    return new FormArray([
      ItemFormControlComponent.buildItem('aaa')
    ]);
  }

}
