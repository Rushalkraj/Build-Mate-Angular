const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dummy orders data
const ordersData = [
  {
    orderId: "ORD-2025-001",
    customerName: "Acme Corporation",
    items: [
      { name: "Laptop Dell XPS 13", quantity: 5, unitPrice: 1299.99 },
      { name: "Wireless Mouse", quantity: 5, unitPrice: 29.99 }
    ],
    totalAmount: 6649.90,
    status: "Processing",
    orderDate: "2025-09-28T10:30:00Z",
    shippingAddress: "123 Business St, Oslo, Norway",
    contact: "john.doe@acme.com"
  },
  {
    orderId: "ORD-2025-002", 
    customerName: "Tech Solutions AS",
    items: [
      { name: "Monitor 27\" 4K", quantity: 3, unitPrice: 549.99 },
      { name: "USB-C Hub", quantity: 3, unitPrice: 89.99 }
    ],
    totalAmount: 1919.94,
    status: "Shipped",
    orderDate: "2025-09-27T14:15:00Z",
    shippingAddress: "456 Tech Park, Bergen, Norway",
    contact: "orders@techsolutions.no"
  },
  {
    orderId: "ORD-2025-003",
    customerName: "Nordic Industries",
    items: [
      { name: "Office Chair Pro", quantity: 10, unitPrice: 399.99 },
      { name: "Standing Desk", quantity: 4, unitPrice: 799.99 }
    ],
    totalAmount: 7199.86,
    status: "Delivered",
    orderDate: "2025-09-25T09:00:00Z",
    shippingAddress: "789 Industrial Ave, Trondheim, Norway",
    contact: "procurement@nordic.no"
  },
  {
    orderId: "ORD-2025-004",
    customerName: "StartUp Hub",
    items: [
      { name: "MacBook Pro 16\"", quantity: 2, unitPrice: 2799.99 },
      { name: "iPad Pro 12.9\"", quantity: 2, unitPrice: 1299.99 }
    ],
    totalAmount: 8199.96,
    status: "Pending",
    orderDate: "2025-09-30T11:45:00Z",
    shippingAddress: "321 Innovation St, Stavanger, Norway",
    contact: "admin@startuphub.no"
  },
  {
    orderId: "ORD-2025-005",
    customerName: "Global Logistics",
    items: [
      { name: "Printer HP LaserJet", quantity: 1, unitPrice: 899.99 },
      { name: "Paper A4 500 sheets", quantity: 20, unitPrice: 12.99 },
      { name: "Toner Cartridge", quantity: 4, unitPrice: 129.99 }
    ],
    totalAmount: 1679.74,
    status: "Processing",
    orderDate: "2025-09-29T16:20:00Z",
    shippingAddress: "654 Logistics Blvd, Kristiansand, Norway",
    contact: "orders@globallogistics.no"
  }
];

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('no-NO', { 
    style: 'currency', 
    currency: 'NOK' 
  }).format(amount);
};

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ERP Orders API'
  });
});

// GET /api/orders - Returns a list of all orders
app.get('/api/orders', (req, res) => {
  try {
    // Optional query parameters for filtering
    const { status, customer, limit } = req.query;
    
    let filteredOrders = [...ordersData];
    
    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    // Filter by customer name if provided
    if (customer) {
      filteredOrders = filteredOrders.filter(order => 
        order.customerName.toLowerCase().includes(customer.toLowerCase())
      );
    }
    
    // Limit results if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredOrders = filteredOrders.slice(0, limitNum);
      }
    }
    
    // Add formatted currency for display
    const ordersWithFormatted = filteredOrders.map(order => ({
      ...order,
      totalAmountFormatted: formatCurrency(order.totalAmount),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }));
    
    res.json({
      success: true,
      count: ordersWithFormatted.length,
      orders: ordersWithFormatted
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// GET /api/orders/:id - Returns details of a single order by orderId
app.get('/api/orders/:id', (req, res) => {
  try {
    const orderId = req.params.id;
    const order = ordersData.find(o => o.orderId === orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found',
        message: `Order with ID ${orderId} does not exist`
      });
    }
    
    // Calculate additional details
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsWithSubtotal = order.items.map(item => ({
      ...item,
      subtotal: item.quantity * item.unitPrice,
      subtotalFormatted: formatCurrency(item.quantity * item.unitPrice),
      unitPriceFormatted: formatCurrency(item.unitPrice)
    }));
    
    const orderWithDetails = {
      ...order,
      totalAmountFormatted: formatCurrency(order.totalAmount),
      itemCount,
      items: itemsWithSubtotal,
      orderDateFormatted: new Date(order.orderDate).toLocaleDateString('no-NO'),
      daysAgo: Math.floor((new Date() - new Date(order.orderDate)) / (1000 * 60 * 60 * 24))
    };
    
    res.json({
      success: true,
      order: orderWithDetails
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// POST /api/chat - Chatbot endpoint for order inquiries
app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    const userMessage = message.toLowerCase();
    let response = '';
    
    // Simple chatbot logic for order-related queries
    if (userMessage.includes('order') && (userMessage.includes('status') || userMessage.includes('check'))) {
      const orderCount = ordersData.length;
      const statusCounts = ordersData.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      
      response = `I can help you check order status! We currently have ${orderCount} orders: `;
      Object.entries(statusCounts).forEach(([status, count]) => {
        response += `${count} ${status}, `;
      });
      response = response.slice(0, -2) + '. Would you like details about a specific order?';
      
    } else if (userMessage.includes('order') && userMessage.includes('list')) {
      const recentOrders = ordersData.slice(0, 3);
      response = `Here are our recent orders:\n`;
      recentOrders.forEach(order => {
        response += `• ${order.orderId} - ${order.customerName} (${order.status})\n`;
      });
      response += `\nWould you like details about any specific order?`;
      
    } else if (userMessage.match(/ord-\d{4}-\d{3}/i)) {
      const orderIdMatch = userMessage.match(/ord-\d{4}-\d{3}/i);
      const orderId = orderIdMatch[0].toUpperCase();
      const order = ordersData.find(o => o.orderId === orderId);
      
      if (order) {
        response = `Found order ${orderId} for ${order.customerName}. Status: ${order.status}. Total: ${formatCurrency(order.totalAmount)}. Would you like more details?`;
      } else {
        response = `I couldn't find order ${orderId}. Please check the order ID and try again.`;
      }
      
    } else if (userMessage.includes('help') || userMessage.includes('what can you do')) {
      response = `I can help you with order-related queries! Try asking me:
      • "Show me order status"
      • "List recent orders" 
      • "Check order ORD-2025-001"
      • "How many orders do we have?"
      
      I can provide information about order details, status, customers, and more!`;
      
    } else if (userMessage.includes('customer') || userMessage.includes('client')) {
      const customers = [...new Set(ordersData.map(o => o.customerName))];
      response = `We have orders from ${customers.length} customers: ${customers.join(', ')}. Which customer would you like to know more about?`;
      
    } else {
      // Default responses for other queries
      const responses = [
        `I understand you're asking about "${message}". I can help you with order information, status checks, and customer details. What specific information do you need?`,
        `That's an interesting question about "${message}". I'm specialized in order management. Would you like me to check order statuses or customer information?`,
        `I see you mentioned "${message}". I can provide details about orders, customers, and order statuses. How can I assist you with order management today?`
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ERP Orders API Server running on port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   GET  http://localhost:${PORT}/api/orders`);
  console.log(`   GET  http://localhost:${PORT}/api/orders/{id}`);
  console.log(`   POST http://localhost:${PORT}/api/chat`);
  console.log(`\n💡 Try: GET http://localhost:${PORT}/api/orders?status=processing`);
});

module.exports = app;