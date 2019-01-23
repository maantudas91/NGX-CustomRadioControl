import { newId, isDefined, isObject } from './utils';
import { RadioControlComponent } from './radio-control.component';
import { SelectionModel } from './selection-model';

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

export class ItemsList {

	constructor(
		private _ngRadioControl: RadioControlComponent,
		private _selectionModel : SelectionModel 
	){}

	private _items: NgOption[] = [];

    get items(): NgOption[] {
        return this._items;
    }

	get selectedItems() {
        return this._selectionModel.value;
    }

    select(item: NgOption) {
        if (item.selected) {
            return;
        }
        this.clearSelected();
        this._selectionModel.select(item);
    }

    clearSelected() {
        this._selectionModel.clear();
        this._items.forEach((item) => {
            item.selected = false;
            item.marked = false;
        });
        
    }

    findItem(value: any): NgOption {
        let findBy: (item: NgOption) => boolean;
        if (this._ngRadioControl.bindValue) {
            findBy = item => this.resolveNested(item.value, this._ngRadioControl.bindValue) === value
        } else {
            findBy = item => item.value === value && item.label && item.label === this.resolveNested(value, this._ngRadioControl.bindLabel)
        }
        return this._items.find(item => findBy(item));
    }



	mapItem(item: any, index: number): any {
        const label = isDefined(item.$ngOptionLabel) ? item.$ngOptionLabel : this.resolveNested(item, this._ngRadioControl.bindLabel);
        const value = isDefined(item.$ngOptionValue) ? item.$ngOptionValue : item;
        return {
            index: index,
            label: isDefined(label) ? label.toString() : '',
            value: value,
            disabled: item.disabled,
            htmlId: newId(),
        };
    }

	setItems(items: any[]) {
		this._items = items.map((item, index) => this.mapItem(item, index));
		console.log(this._items);
	}

	resolveNested(option: any, key: string): any {
        if (!isObject(option)) {
            return option;
        }
        if (key.indexOf('.') === -1) {
            return option[key];
        }
    }

    mapSelectedItems() {
        for (const selected of this.selectedItems) {
            const value = this._ngRadioControl.bindValue ? this.resolveNested(selected.value, this._ngRadioControl.bindValue) : selected.value;
            const item = isDefined(value) ? this.findItem(value) : null;
            this._selectionModel.unselect(selected);
            this._selectionModel.select(item || selected);
        }
    }
}