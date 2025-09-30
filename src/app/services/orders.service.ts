import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
    name: string;
    quantity: number;
    unitPrice: number;
    unitPriceFormatted?: string;
    subtotal?: number;
    subtotalFormatted?: string;
}

export interface Order {
    orderId: string;
    customerName: string;
    items: OrderItem[];
    totalAmount: number;
    totalAmountFormatted?: string;
    status: string;
    orderDate: string;
    orderDateFormatted?: string;
    shippingAddress?: string;
    contact?: string;
    itemCount?: number;
    daysAgo?: number;
}

export interface OrdersResponse {
    success: boolean;
    count: number;
    orders: Order[];
}

export interface OrderResponse {
    success: boolean;
    order: Order;
}

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    // Get all orders with optional filtering
    getOrders(params?: { status?: string; customer?: string; limit?: number }): Observable<OrdersResponse> {
        let queryParams = '';
        if (params) {
            const searchParams = new URLSearchParams();
            if (params.status) searchParams.append('status', params.status);
            if (params.customer) searchParams.append('customer', params.customer);
            if (params.limit) searchParams.append('limit', params.limit.toString());
            queryParams = searchParams.toString() ? '?' + searchParams.toString() : '';
        }

        return this.http.get<OrdersResponse>(`${this.baseUrl}/orders${queryParams}`);
    }

    // Get a specific order by ID
    getOrder(orderId: string): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${this.baseUrl}/orders/${orderId}`);
    }

    // Get orders by status
    getOrdersByStatus(status: string): Observable<OrdersResponse> {
        return this.getOrders({ status });
    }

    // Get orders by customer
    getOrdersByCustomer(customer: string): Observable<OrdersResponse> {
        return this.getOrders({ customer });
    }

    // Health check
    checkApiHealth(): Observable<any> {
        return this.http.get(`${this.baseUrl}/health`);
    }
}