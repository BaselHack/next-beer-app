import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpProvider {

  constructor(private http: Http) {
  }

  /**
   * HTTP GET request.
   *
   * @param {string} url
   * @param {string} token
   * @param {string} userId
   * @returns {Promise<any>}
   */
  public get(url, token = null, userId = null) {
    return new Promise(resolve => {
      let headers = this.getHeaders(token, userId);
      // 1. HTTP GET Request
      // 2. Map response
      // 3. Resolve Data
      this.http.get(url, {headers: headers})
        .map(res => res.json())
        .subscribe(response => {
          resolve(response);
        }, xhr => {
          console.warn(xhr);
        });
    });
  }

  /**
   * HTTP POST request.
   *
   * @param {string} url
   * @param {object} data
   * @param {any} token
   * @param {any} userId
   * @returns {Promise<any>}
   */
  public post(url, data, token = null, userId = null) {
    return new Promise(resolve => {
      let headers = this.getHeaders(token, userId);
      let json = JSON.stringify(data);

      this.http.post(url, json, {headers: headers})
        .map(res => res.json())
        .subscribe(response => {
          resolve(response);
        }, xhr => {
          console.warn(xhr);
        });
    });
  }

  /**
   * Prepare HEADERS for Request.
   *
   * @param token
   * @param userId
   * @returns {Headers}
   */
  private getHeaders(token, userId) {
    // Set Content-Type Header by default to application/x-www-form-urlencoded
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Headers can be set like this
    if (token !== null) {
      headers.append("x-token:", token);
      headers.append("x-user-id", userId);
    }

    return headers;
  }
}

