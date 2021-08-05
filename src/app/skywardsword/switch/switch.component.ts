import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

@Component({
    selector: 'ss-switch',
    template: `
<div class="custom-control custom-switch">
    <input class="custom-control-input"
            type="checkbox"
            [id]="id"
            [ngModel]="innerValue"
            (ngModelChange)="onChangeCallback($event)" />
    <label class="custom-control-label" [for]="id">{{label}}</label>
</div>`,
    styles: [
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true
        }
    ]
})
export class SwitchComponent implements ControlValueAccessor {
    @Input() public label = '';
    innerValue = '';
    @Input() id = `ss-switch-${nextId++}`;

    onChangeCallback: (_: any) => void = () => {};
    onTouchedCallback: () => void = () => {};

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }
}
