import { 
  Component, 
  Input, 
  forwardRef, 
  Output, 
  EventEmitter, 
  OnChanges, 
  SimpleChanges, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef,
  ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { newId, isObject, isDefined } from '../../shared/utils';

const CUSTOM_RADIO_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomRadioControlComponent),
  multi: true
}

@Component({
  selector: 'custom-radio',
  templateUrl: './custom-radio-control.component.html',
  styleUrls: ['./custom-radio-control.component.scss'],
  providers : [CUSTOM_RADIO_ACCESSOR],
  changeDetection : ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None,
  host : {
    'class' : 'custom-radio'
  }

})
export class CustomRadioControlComponent implements OnChanges, ControlValueAccessor {

  
  //@Input() items : Array<any>;
  @Input() bindLabel : string;
  @Input() bindValue : string;

  @Output('change') changeEvent = new EventEmitter();

  private _items :any;
  private _selected :Array<any> =  [];

  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  constructor(
    private _cd: ChangeDetectorRef
  ) { }

  @Input()
  set items(value: any){
      this._setItems(value);
  }

  get items(){
    return this._items;
  }

  ngOnChanges(changes : SimpleChanges){
    if(changes.items){
  		this._setItems(changes.items.currentValue || []);
  	}
  }

  _setItems(items : any){
      this._items = items.map((item, index) => this.mapItem(item, index));
  }

  mapItem(item: any, index: number): any {
    const label = isDefined(item.$ngOptionLabel) ? item.$ngOptionLabel : this.resolveNested(item, this.bindLabel);
    const value = isDefined(item.$ngOptionValue) ? item.$ngOptionValue : item;
    return {
        index: index,
        label: isDefined(label) ? label.toString() : '',
        value: value,
        disabled: item.disabled,
        htmlId: newId(),
    };
  }

  resolveNested(option: any, key: string): any {
    if (!isObject(option)) {
        return option;
    }
    if (key.indexOf('.') === -1) {
        return option[key];
    }
  }


  selectItem(item){
    this._selected = [];
    item.selected = true;
    let val = null;
    if(this.bindValue){
      val = this.resolveNested(item.value, this.bindValue);
    }else{
      val = item.value;
    }
    this._selected.push(item);
    //this._selected = [...this._selected, item];
    this.changeEvent.emit(item.value);
    this._onChange(val);
    this._cd.markForCheck();
  }


  findItem(value: any) {
    let findBy: (item) => boolean;
    if (this.bindValue) {
        findBy = item => this.resolveNested(item.value, this.bindValue) === value
    } else {
        findBy = item => item.value === value || item.label && item.label === this.resolveNested(value, this.bindLabel)
    }
    return this.items.find(item => findBy(item));
  }

  isActive(item){
    const selected = this._selected.filter(x => x.value == item.value);
    if( selected.length > 0) return true;
  	else return false;
  }


  writeValue(value : any){
    this._handleWriteValue(value);
    this._cd.markForCheck();
  }

  _handleWriteValue(value){
    const select = (val: any) => {
      let item = this.findItem(val);
      if (item) {
        this.selectItem(item);
      }
    };

    select(value);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
      this._onTouched = fn;
  }

}
