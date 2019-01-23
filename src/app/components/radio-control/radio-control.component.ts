import { 
	Component, 
	OnInit, 
	forwardRef, 
	ViewEncapsulation,
	Input,
	ChangeDetectionStrategy,
	OnChanges,
	SimpleChanges,
	ChangeDetectorRef,
	InjectionToken,
	Inject,
	Output,
	EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isDefined, isObject } from './utils';
import { ItemsList } from './items-list';
import { SelectionModelFactory } from './selection-model';

export interface NgOption {
    [name: string]: any;
    index?: number;
    htmlId?: string;
    selected?: boolean;
    disabled?: boolean;
    marked?: boolean;
    label?: string;
    value?: string | Object;
}
export const SELECTION_MODEL_FACTORY = new InjectionToken<SelectionModelFactory>('ng-select-selection-model');

const RADIOCONTROL_ACCESSOR : any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => RadioControlComponent),
	multi: true, 
};

@Component({
  selector: 'radio-control',
  templateUrl: './radio-control.component.html',
  styleUrls: ['./radio-control.component.scss'],
  providers: [RADIOCONTROL_ACCESSOR],
  changeDetection : ChangeDetectionStrategy.OnPush,
  encapsulation : ViewEncapsulation.None,
  host:{
  	'class':'radio-control'
  }
})
export class RadioControlComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() items : Array<any>;
  @Input() bindLabel: string;
  @Input() bindValue: string;

  @Output('change') changeEvent = new EventEmitter();


  _primitive : any;

  itemsList: ItemsList;


  private _onChange = (_: any) => { };
  private _onTouched = () => { };
  
  constructor(
  	private _cd : ChangeDetectorRef,
  	@Inject(SELECTION_MODEL_FACTORY) newSelectionModel: SelectionModelFactory
  	) { 
  	this.itemsList = new ItemsList(this, newSelectionModel());
  }

  	get selectedItems(): NgOption[] {
        return this.itemsList.selectedItems;
    }

    get _items(){
    	return this.itemsList.items;
    }

    get selectedValues() {
        return this.selectedItems.map(x => x.value);
    }

    get hasValue() {
        return this.selectedItems.length > 0;
    }

	  ngOnInit() {
	  	//console.log(this.items)
	  }

  ngOnChanges(changes: SimpleChanges) {
  	if(changes.items){
  		this._setItems(changes.items.currentValue || []);
  	}
  }

  _setItems(items : any){
  		const firstItem = items[0];
        this._primitive = isDefined(firstItem) ? !isObject(firstItem) : this._primitive;
        this.itemsList.setItems(items);
        if (items.length > 0 && this.hasValue) {
            this.itemsList.mapSelectedItems();
        }
  }

  private _handleWriteValue(ngModel: any | any[]) {
  		const select = (val: any) => {
  			console.log('val', val)
            let item = this.itemsList.findItem(val);
            if (item) {
                this.itemsList.select(item);
            } else {
                const isValObject = isObject(val);
                const isPrimitive = !isValObject && !this.bindValue;
                if ((isValObject || isPrimitive)) {
                    this.itemsList.select(this.itemsList.mapItem(val, null));
                } else if (this.bindValue) {
                    item = {
                        [this.bindLabel]: null,
                        [this.bindValue]: val
                    };
                    this.itemsList.select(this.itemsList.mapItem(item, null));
                }
            }
        };
  		select(ngModel);
  }

  writeValue(value: any | any[]): void{
  	console.log(value);
  	this._handleWriteValue(value);
  	this._cd.markForCheck();
  }

  registerOnChange(fn: (_: any) => {}): void {
		this._onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
		this._onTouched = fn; 
  } 

   select(item: NgOption) {
   		if (!item.selected) {
   			this.itemsList.select(item);
   		}
   		this._updateNgModel();
   }

   _updateNgModel(){
   		const model = [];
        for (const item of this.selectedItems) {
        	if (this.bindValue) { 
        		let value = null;
                if (item.children) {
                    value = item.value;
                } else {
                    value = this.itemsList.resolveNested(item.value, this.bindValue);
                }
                model.push(value);
        	}else {
                model.push(item.value);
            }
        }
        const selected = this.selectedItems.map(x => x.value);
        this._onChange(isDefined(model[0]) ? model[0] : null);
        this.changeEvent.emit(selected[0]);
        this._cd.markForCheck();
   }

}
