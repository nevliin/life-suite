import { Component, OnInit } from '@angular/core';
import {CompareEntry} from "../compare-entry";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-inv-comparison',
  templateUrl: './inv-comparison.component.html',
  styleUrls: ['./inv-comparison.component.css']
})
export class InvComparisonComponent implements OnInit {

  comparison: CompareEntry[];

  constructor(
    readonly http: HttpClient
  ) {
  }

  async ngOnInit() {
    this.comparison = ((await this.http.get('/api/inv/comparison').toPromise()) as any).comparison;
    this.comparison = this.comparison.filter(compareEntry => compareEntry.amount != 0);
  }


}
