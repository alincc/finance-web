///<reference path="../../../../../../node_modules/rxjs/internal/operators/combineAll.d.ts"/>
import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {Breakdown} from "../../../model/breakdown.model";
import {HttpClient} from "@angular/common/http";
import {combineAll, toArray, map} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {Account} from "../../../model/account.model";

@Injectable()
export class BreakdownService {

  constructor(private http: HttpClient) { }

  getAccountBreakdown(accountId: any, frequency: any = 'monthly'): Observable<Breakdown[]> {
    return <Observable<Breakdown[]>>this.http.get(this.getAccountBreakdownUrl(accountId, frequency))
      .pipe(combineAll(), map((response) => this.createBreakdownFrom(response[0])), toArray())
  }

  getTotalAccountBreakdown(account: Account, breakdownList: Breakdown[] = []) {
    let accountBreakdown = breakdownList.reduce((totalBreakdown: Breakdown, breakdown: Breakdown) => {
      totalBreakdown.balance = totalBreakdown.balance + breakdown.balance;
      totalBreakdown.totalCredit += breakdown.totalCredit;
      totalBreakdown.totalDebit += breakdown.totalDebit;
      totalBreakdown.allocatedAmount += breakdown.allocatedAmount;
      return totalBreakdown;
    }, new Breakdown());

    accountBreakdown.label = account.name;
    return accountBreakdown;
  }

  getAllAccountBreakdown(frequency: any = 'monthly'): Observable<Breakdown[]> {
    return <Observable<Breakdown[]>>this.http.get(this.getAllAccountBreakdownUrl(frequency))
      .pipe(combineAll(), map((response) => this.createBreakdownFrom(response[0])), toArray())
  }

  private createBreakdownFrom(object: Object): Breakdown {
    return Object.assign(new Breakdown(), object);
  }

  private getAccountBreakdownUrl(accountId: any, frequency: any) {
    return `${this.accountUrl}/${accountId}/${frequency}-breakdown`;
  }

  private getAllAccountBreakdownUrl(frequency: any) {
    return `${environment.financeServer}/${frequency}-breakdown`;
  }

  private get accountUrl(): string {
    return `${environment.financeServer}/account`;
  }
}
