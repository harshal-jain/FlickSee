import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private _httpClient: HttpClient) { }

  // Getting data from api
  get(url: string): Observable<any> {
    return this._httpClient.get(url);
  }

  // For data save
  post(url: string, model: any): Observable<any> {

    const body = JSON.stringify(model); // it will be now in json format
    return this._httpClient.post(url, body)

  }

  // For image save
  postImage(url: string, model: any): Observable<any> {

    let httpHeaders = new HttpHeaders()
    .set('isfile','');
    return this._httpClient.post(url, model,{
      headers : httpHeaders
    });

  }

  // For Update
  put(url: string, id: number, model: any): Observable<any> {

    const body = JSON.stringify(model); // it will be now in json format
    return this._httpClient.put(url + id, body)

  }

  // For Delete
  delete(url: string, id: number): Observable<any> {

    return this._httpClient.delete(url + id);

  }



  // // Getting data from api
  // get(url: string): Observable<any> {
  //   return this._httpClient.get(url);
  // }

  // // For data save
  // post(url: string, model: any): Observable<any> {

  //   // api pe light body code bjenge
  //   const body = JSON.stringify(model); // it will be now in json format

  //   // hum api ko btaenge bhi ki joh hum data bhej rhe hai voh json format me hai
  //   let httpHeaders = new HttpHeaders()
  //     .set('Content-Type', 'application/json');

  //   // ab iss header ko pass kr denge
  //   return this._httpClient.post(url, body, {
  //     headers: httpHeaders
  //   })

  // }

  // // For Update
  // put(url: string, id: number, model: any): Observable<any> {

  //   // api pe light body code bjenge
  //   const body = JSON.stringify(model); // it will be now in json format

  //   // hum api ko btaenge bhi ki joh hum data bhej rhe hai voh json format me hai
  //   let httpHeaders = new HttpHeaders()
  //     .set('Content-Type', 'application/json');

  //   // ab iss header ko pass kr denge
  //   return this._httpClient.put(url + id, body, {
  //     headers: httpHeaders
  //   })

  // }

  // // For Delete
  // delete(url: string, id: number): Observable<any> {

  //   return this._httpClient.delete(url + id);

  // }

}
