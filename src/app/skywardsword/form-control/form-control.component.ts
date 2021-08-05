import { Component, Input } from '@angular/core';

@Component({
    selector: 'ss-form-control[label]',
    templateUrl: 'form-control.component.html',
    styleUrls: ['form-control.component.scss']
})
export class FormControlComponent {
    @Input()
    public label = '';
}
