# ERP Orders API Backend

A Node.js/Express REST API backend for the ERP system with dummy orders data for testing the Angular chatbot frontend.

## API Endpoints

### Orders Management

#### GET /api/orders
Returns a list of all orders with optional filtering.

**Query Parameters:**
- `status` - Filter by order status (processing, shipped, delivered, pending)
- `customer` - Filter by customer name (partial match)
- `limit` - Limit the number of results

**Example:**
```
GET http://localhost:3000/api/orders
GET http://localhost:3000/api/orders?status=processing
GET http://localhost:3000/api/orders?customer=acme&limit=2
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "orderId": "ORD-2025-001",
      "customerName": "Acme Corporation",
      "items": [
        {
          "name": "Laptop Dell XPS 13",
          "quantity": 5,
          "unitPrice": 1299.99
        }
      ],
      "totalAmount": 6649.90,
      "totalAmountFormatted": "kr 6 649,90",
      "status": "Processing",
      "orderDate": "2025-09-28T10:30:00Z",
      "itemCount": 5
    }
  ]
}
```

#### GET /api/orders/{id}
Returns detailed information about a specific order.

**Example:**
```
GET http://localhost:3000/api/orders/ORD-2025-001
```

**Response:**
```json
{
  "success": true,
  "order": {
    "orderId": "ORD-2025-001",
    "customerName": "Acme Corporation",
    "items": [
      {
        "name": "Laptop Dell XPS 13",
        "quantity": 5,
        "unitPrice": 1299.99,
        "unitPriceFormatted": "kr 1 299,99",
        "subtotal": 6499.95,
        "subtotalFormatted": "kr 6 499,95"
      }
    ],
    "totalAmount": 6649.90,
    "totalAmountFormatted": "kr 6 649,90",
    "status": "Processing",
    "orderDate": "2025-09-28T10:30:00Z",
    "orderDateFormatted": "28.09.2025",
    "shippingAddress": "123 Business St, Oslo, Norway",
    "contact": "john.doe@acme.com",
    "itemCount": 5,
    "daysAgo": 2
  }
}
```

### Chatbot Integration

#### POST /api/chat
Chatbot endpoint that provides intelligent responses about orders.

**Request:**
```json
{
  "message": "Show me order status"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I can help you check order status! We currently have 5 orders: 2 Processing, 1 Shipped, 1 Delivered, 1 Pending. Would you like details about a specific order?",
  "timestamp": "2025-09-30T12:00:00.000Z"
}
```

**Supported chat queries:**
- Order status inquiries
- List recent orders
- Check specific orders (mention order ID)
- Customer information
- General help

### Health Check

#### GET /api/health
Returns the API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-30T12:00:00.000Z",
  "service": "ERP Orders API"
}
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

3. **Server will start on:**
   ```
   http://localhost:3000
   ```

## Dummy Data

The API includes 5 sample orders with the following data:
- Order IDs: ORD-2025-001 through ORD-2025-005
- Norwegian companies as customers
- Various product types (laptops, monitors, office equipment)
- Different order statuses (Processing, Shipped, Delivered, Pending)
- Realistic pricing in Norwegian Kroner (NOK)

## CORS Configuration

The API is configured to allow requests from the Angular frontend running on `http://localhost:4201`.

## Features

- ✅ RESTful API design
- ✅ Error handling and validation
- ✅ Query parameter filtering
- ✅ Formatted currency display (NOK)
- ✅ Smart chatbot responses
- ✅ CORS enabled for frontend integration
- ✅ Security headers with Helmet
- ✅ Comprehensive order details
- ✅ Norwegian localization

## Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security headers
- `dotenv` - Environment variables
- `nodemon` - Development auto-reload (dev dependency)