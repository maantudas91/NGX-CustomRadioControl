import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'item-control',
  templateUrl: './item-form-control.component.html',
  styleUrls: ['./item-form-control.component.scss']
})
export class ItemFormControlComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  public index: number;

  @Input()
  public item: FormGroup;

  @Output()
  public removed: EventEmitter<number> = new EventEmitter<number>();

  static buildItem(val: string) {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      quantity: new FormControl()
    })
  }

}
