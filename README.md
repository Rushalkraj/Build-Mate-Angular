# ERP Frontend Application

This is an Angular frontend application built based on a business ERP interface design. It features a modern, responsive layout with an integrated chatbot functionality.

## Features

- **Modern ERP Interface**: Clean, professional layout matching business application standards
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Integrated Chatbot**: Floating chatbot icon with sliding panel interface
- **Business Modules**: Four main sections (ORDREOPPGAVER, FAKTURAOPPGAVER, SPØRRING, VEDLIKEHOLD)
- **Real-time Chat**: Message display with typing indicators and timestamps
- **API Integration**: Ready for REST API integration (currently using mock responses)

## Components Structure

```
src/app/
├── components/
│   ├── header/              # Top navigation and branding
│   ├── navigation/          # Left sidebar navigation
│   ├── main-content/        # Main business modules display
│   └── chatbot/             # Floating chatbot with panel
├── services/
│   └── chat.service.ts      # Handles chat functionality and API calls
└── app.component.ts         # Main application component
```

## Key Features

### Chatbot Functionality
- **Floating Button**: Bottom-right corner with bounce animation
- **Sliding Panel**: Smooth slide-in from the right
- **Message System**: User and bot messages with timestamps
- **Typing Indicator**: Visual feedback when bot is responding
- **API Ready**: Configured for `/api/chat` endpoint
- **Responsive**: Adapts to mobile screens

### UI Design
- **Professional Styling**: Clean, modern business application look
- **Color Scheme**: Red primary color (#dc2626) with professional grays
- **Typography**: Inter font for clean, readable text
- **Icons**: Font Awesome icons throughout the interface
- **Animations**: Smooth transitions and hover effects

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Access Application**:
   Open your browser to `http://localhost:4200`

## API Integration

The chatbot is configured to call a REST API endpoint:

```typescript
// Current endpoint configuration
POST /api/chat
{
  "message": "user message text"
}
```

To integrate with a real API:
1. Update the `ChatService` in `src/app/services/chat.service.ts`
2. Replace the mock response logic with actual HTTP calls
3. Configure your API endpoint URL

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interface elements
- Optimized chatbot for mobile screens

## Technologies Used

- **Angular 17**: Modern Angular with standalone components
- **TypeScript**: Type-safe development
- **SCSS**: Advanced styling with variables and mixins
- **RxJS**: Reactive programming for chat functionality
- **Font Awesome**: Icon library
- **Inter Font**: Modern, readable typography