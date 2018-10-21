import { Component, OnInit } from '@angular/core';
import {map} from "rxjs/operators";
import {InvEntry} from "../inv-entry";
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-inv-expirations',
  templateUrl: './inv-expirations.component.html',
  styleUrls: ['./inv-expirations.component.css']
})
export class InvExpirationsComponent implements OnInit {

  expirationsForm: FormGroup = new FormGroup({
    months: new FormControl(3)
  });

  entries: InvEntry[] = [];
  expiredEntries: InvEntry[] = [];
  nextExpiringEntries: InvEntry[] = [];

  constructor(
    readonly http: HttpClient
  ) { }

  async ngOnInit() {
    await this.fetchEntries();
  }

  async fetchEntries() {
    this.entries = (await this.http.get('/api/inv/entry/list')
      .pipe(map((response: { data: InvEntry[] }) => { return response.data
          .map((entry: InvEntry) => {
            entry.expirationDate = new Date(entry.expirationDate);
            return entry;
          })
        })
      ).toPromise()).sort((entry1, entry2) => entry1.expirationDate.getTime() - entry2.expirationDate.getTime());
    this.expiredEntries = this.entries.filter(entry => entry.expirationDate.getTime() < (new Date()).getTime());
    this.findNextExpirations();
  }

  findNextExpirations() {
    const months: number = Number.parseInt(this.expirationsForm.get('months')!.value);
    this.nextExpiringEntries = this.entries.filter(entry => {
      const date: Date = new Date();
      date.setMonth(date.getMonth()+months);
      return date.getTime() > entry.expirationDate.getTime() && entry.expirationDate.getTime() > (new Date()).getTime();
    });
  }

  async eatConfirmation(id: number) {
    await this.http.delete('/api/inv/entry/delete/' + id).toPromise();
    const index: number = this.entries.findIndex((entry: InvEntry) => entry.id === id);
    this.entries.splice(index, 1);
    this.fetchEntries();
  }

}
