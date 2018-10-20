import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {InvEntry} from "../inv-entry";
import {map} from "rxjs/operators";
import {getExpressionLoweringTransformFactory} from "@angular/compiler-cli/src/transformers/lower_expressions";

@Component({
  selector: 'app-inv-add',
  templateUrl: './inv-add.component.html',
  styleUrls: ['./inv-add.component.css']
})
export class InvAddComponent implements OnInit {

  nextId: number;

  entryForm: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    amount: new FormControl(),
    market: new FormControl(),
    price: new FormControl(),
    producer: new FormControl(),
    weight: new FormControl(),
    kcal: new FormControl(),
    expirationDate: new FormControl(),
    note: new FormControl()
  });

  constructor(
    readonly http: HttpClient
  ) { }

  async ngOnInit() {
    this.nextId = ((await this.http.get('/api/inv/nextId').toPromise()) as any).nextId;
    this.entryForm.get('id').setValue(this.nextId);
  }

  submit() {

  }

  async autoFill() {
    const result: InvEntry = ((await this.http.post('/api/inv/autoFill', {
      name: this.entryForm.get('name').value
    }).toPromise()) as any).data;
    this.entryForm.patchValue(result);
    const expirationDate: Date = new Date(result.expirationDate);
    this.entryForm.get('expirationDate').setValue(expirationDate.getFullYear() + '-' + expirationDate.getUTCMonth() + '-' + expirationDate.getUTCDay());
  }

  adjustIds(amount: number) {
    if(amount === 1) {
      this.entryForm.get('id').setValue(this.nextId);
    } else if(amount > 1) {
      this.entryForm.get('id').setValue(this.nextId + '-' + (this.nextId + amount - 1));
    }
  }

}
