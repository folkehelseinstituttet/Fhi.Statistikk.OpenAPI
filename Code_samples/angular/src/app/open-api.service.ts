import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { DataQuery } from './models/dataQuery.model';
import { Dataset } from './models/dataset.model';
import { DimensionsArray } from './models/dimension.model';
import { SourceInfo } from './models/sourceInfo.model';
import { Table } from './models/table.model';
import { Metadata } from './models/metadata.model';
import { Flag } from './models/flag.model';

@Injectable({
  providedIn: 'root',
})
export class OpenApiService {
  //apiUrl = 'https://statistikk-data.fhi.no/api/open/v1/'
  apiUrl = 'https://app-allvis-api-dev.azurewebsites.net/api/open/v1/';

  constructor(private http: HttpClient) {}

  getSources(): Observable<Array<SourceInfo>> {
    const url = this.apiUrl + 'Common/Source';
    return this.http.get<Array<SourceInfo>>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          console.error('Server error:', error);
        }
        return throwError(() => error);
      })
    );
  }

  getTables(sourceId: string): Observable<Array<Table>> {
    const url = this.apiUrl + sourceId + '/Table';
    return this.http
      .get<Array<Table>>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            console.error('Server error:', error);
          }
          return throwError(() => error);
        })
      );
  }

  getMetadata(sourceId: string, tableId: number): Observable<Metadata> {
    const endpoint = sourceId + '/Table/' + tableId + '/metadata';
    const url = this.apiUrl + endpoint;
    return this.http
      .get<Metadata>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            console.error('Server error:', error);
          }
          return throwError(() => error);
        })
      );
  }

  getDimensions(
    sourceId: string,
    tableid: number
  ): Observable<DimensionsArray> {
    const endpoint = sourceId + '/Table/' + tableid + '/dimension';
    const url = this.apiUrl + endpoint;
    return this.http
      .get<DimensionsArray>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            console.error('Server error:', error);
          }
          return throwError(() => error);
        })
      );
  }

  getFlags(sourceId: string, tableId: number): Observable<Array<Flag>> {
    const url = this.apiUrl + sourceId + '/Table/' + tableId + '/flag';
    return this.http.get<Array<Flag>>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          console.error('Server error:', error);
        }
        return throwError(() => error);
      })
    );
  }

  getQuery(sourceId: string, tableId: number): Observable<DataQuery> {
    const url = this.apiUrl + sourceId + '/Table/' + tableId + '/query';
    return this.http
      .get<DataQuery>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            console.error('Server error:', error);
          }
          return throwError(() => error);
        })
      );
  }

  getData(
    sourceId: string,
    tableId: number,
    request: DataQuery
  ): Observable<Dataset> {
    const endpoint = sourceId + '/Table/' + tableId + '/data';
    const url = this.apiUrl + endpoint;
    return this.http
      .post<Dataset>(url, request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            +console.error('Server error:', error);
          }
          return throwError(() => error);
        })
      );
  }
}
