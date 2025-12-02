import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

export interface Product {
  _id?: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // A backend egyezik a fronttal
  private base = `${environment.apiUrl}/termekek`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.base);
  }

  add(product: Product) {
    return this.http.post<Product>(this.base, product);
  }
}
