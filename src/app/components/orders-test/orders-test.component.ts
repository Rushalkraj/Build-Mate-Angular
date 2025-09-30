import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Order } from '../../services/orders.service';

@Component({
    selector: 'app-orders-test',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="orders-test">
      <h2>API Test Panel</h2>
      
      <div class="test-section">
        <h3>Backend API Status</h3>
        <button (click)="testApiHealth()" class="btn btn-primary">Check API Health</button>
        <div *ngIf="healthStatus" class="status-result">
          <span [class]="healthStatus.status === 'OK' ? 'status-ok' : 'status-error'">
            {{ healthStatus.status }} - {{ healthStatus.service }}
          </span>
        </div>
      </div>

      <div class="test-section">
        <h3>Orders API Tests</h3>
        <div class="button-group">
          <button (click)="loadAllOrders()" class="btn btn-secondary">Load All Orders</button>
          <button (click)="loadProcessingOrders()" class="btn btn-secondary">Processing Orders</button>
          <button (click)="loadSpecificOrder()" class="btn btn-secondary">Load ORD-2025-001</button>
        </div>
      </div>

      <div class="results" *ngIf="orders.length > 0">
        <h3>Orders Results ({{ orders.length }})</h3>
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header">
            <span class="order-id">{{ order.orderId }}</span>
            <span class="order-status" [class]="'status-' + order.status.toLowerCase()">
              {{ order.status }}
            </span>
          </div>
          <div class="order-details">
            <p><strong>Customer:</strong> {{ order.customerName }}</p>
            <p><strong>Total:</strong> {{ order.totalAmountFormatted || order.totalAmount | currency:'NOK' }}</p>
            <p><strong>Items:</strong> {{ order.itemCount || order.items.length }} items</p>
            <p><strong>Date:</strong> {{ order.orderDateFormatted || (order.orderDate | date) }}</p>
          </div>
        </div>
      </div>

      <div class="error" *ngIf="errorMessage">
        <p>Error: {{ errorMessage }}</p>
      </div>
    </div>
  `,
    styleUrls: ['./orders-test.component.scss']
})
export class OrdersTestComponent implements OnInit {
    orders: Order[] = [];
    healthStatus: any = null;
    errorMessage: string = '';

    constructor(private ordersService: OrdersService) { }

    ngOnInit(): void {
        this.testApiHealth();
    }

    testApiHealth(): void {
        this.ordersService.checkApiHealth().subscribe({
            next: (response) => {
                this.healthStatus = response;
                this.errorMessage = '';
            },
            error: (error) => {
                this.healthStatus = { status: 'ERROR', service: 'Connection Failed' };
                this.errorMessage = 'Cannot connect to backend API. Make sure the server is running on localhost:3000';
            }
        });
    }

    loadAllOrders(): void {
        this.ordersService.getOrders().subscribe({
            next: (response) => {
                if (response.success) {
                    this.orders = response.orders;
                    this.errorMessage = '';
                }
            },
            error: (error) => {
                this.errorMessage = 'Failed to load orders: ' + error.message;
                this.orders = [];
            }
        });
    }

    loadProcessingOrders(): void {
        this.ordersService.getOrdersByStatus('processing').subscribe({
            next: (response) => {
                if (response.success) {
                    this.orders = response.orders;
                    this.errorMessage = '';
                }
            },
            error: (error) => {
                this.errorMessage = 'Failed to load processing orders: ' + error.message;
                this.orders = [];
            }
        });
    }

    loadSpecificOrder(): void {
        this.ordersService.getOrder('ORD-2025-001').subscribe({
            next: (response) => {
                if (response.success) {
                    this.orders = [response.order];
                    this.errorMessage = '';
                }
            },
            error: (error) => {
                this.errorMessage = 'Failed to load specific order: ' + error.message;
                this.orders = [];
            }
        });
    }
}