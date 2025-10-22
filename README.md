# ASD Project - Release 2.2

This release implements comprehensive e-commerce functionality including User Management, Cart functionality, Checkout/Payment system, Product Catalogue, Search & Filters, Admin Dashboard, Delivery tracking, Customer Support Chat, FAQ system, and Stock Management for the ASD (Advanced Software Development) project.

## 🚀 What's New in Release 2.2

### ✨ Major Improvements
- **Legible ID Schemes**: Products now use `PROD-SKU-XXX` format, Orders use `ORD-YYYYMMDD-XXX` format
- **Enhanced Database Schema**: Updated with comprehensive models for stock history, order tracking, and chat support
- **Improved Package Management**: Fixed all package.json scripts across client, server, and root
- **Comprehensive Testing**: Added test suites for admin and delivery features
- **Better Error Handling**: Enhanced API error responses and validation
- **Performance Optimizations**: Improved database queries and client-side caching

### 🔧 Technical Enhancements
- **Database Migration System**: Proper Prisma migrations with rollback support
- **Environment Configuration**: Centralized environment variable management
- **API Documentation**: Comprehensive endpoint documentation
- **Code Quality**: TypeScript strict mode, ESLint configuration, and proper type definitions

## Features Implemented

### F001 - User Management (Belinda)

- **Account Creation**: New customer registration with email validation
- **Authentication**: Secure login/logout functionality
- **Profile Management**: Edit account details and delete account
- **Security**: Password protection and session management

### F002 - Cart (Vinix)

- **Add to Cart**: Add products with quantity selection
- **Cart Management**: Remove items, update quantities
- **Cart View**: Display all items with real-time price calculation
- **Persistence**: Cart data maintained across sessions

### F003 - Checkout/Payment (Danny)

- **Payment Methods**: Support for card payments and cash on delivery
- **Order Confirmation**: Review items and prices before payment
- **Shipping Details**: Enter delivery address and billing information
- **Order Processing**: Complete purchase workflow

### F004 - Product Catalogue (Vinix)

- **Product Display**: View products with images, prices, and descriptions
- **Category Browsing**: Browse by categories (fruits, dairy, etc.)
- **Product Sorting**: Sort by price, name, or category
- **Stock Display**: Real-time stock level information

### F005 - Search & Filters (Xiao)

- **Search Functionality**: Search products by name or keyword
- **Auto-complete**: Search suggestions and auto-complete
- **Advanced Filters**: Filter by brand, price range, dietary tags
- **Category Navigation**: Browseable product categories

### F007 - Admin Dashboard (Aman)

- **Product Management**: Add, edit, remove products with full CRUD operations
- **Stock Management**: Update product prices and stock levels
- **Analytics**: View sales analytics and performance metrics
- **User Management**: Manage customer accounts and staff access

### F008 - Delivery (Aman)

- **Delivery Options**: Choose delivery method and time slots
- **Address Management**: Enter and validate delivery addresses
- **Order Tracking**: Real-time order status updates with comprehensive status history
- **Delivery Notifications**: Status change notifications and timeline tracking
- **Delivery Interface**: Staff interface for managing deliveries and updating order status

### F009 - Customer Support Chat (Xiao)

- **Live Chat System**: Real-time customer support chat functionality
- **Chat Sessions**: Persistent chat sessions with message history
- **Staff Interface**: Admin interface for managing customer support requests
- **Message Types**: Support for customer, staff, and system messages

### F010 - FAQ System (Xiao)

- **Frequently Asked Questions**: Comprehensive FAQ system with categories
- **Category Management**: Organized FAQ categories (shipping, payment, account, products, general)
- **Admin Management**: Admin interface for managing FAQ content
- **Search Functionality**: Search through FAQ entries

### F006 - Stock Management (Danny)

- **Stock Tracking**: Real-time stock level monitoring and updates
- **Stock History**: Complete audit trail of stock changes with reasons
- **Low Stock Alerts**: Automated notifications for low stock levels
- **Stock Adjustments**: Admin interface for manual stock adjustments

### Database Setup

- **SQLite Database**: Development database with Prisma ORM
- **Enhanced Entity Models**: User, Product, Cart, CartItem, Order, StockHistory, OrderStatusHistory, FAQ, ChatSession, ChatMessage with comprehensive relations
- **Legible ID Schemes**: Products use `PROD-SKU-XXX` format, Orders use `ORD-YYYYMMDD-XXX` format
- **Comprehensive Seed Data**: Initial data including staff user, customer, products, orders, FAQs, chat sessions, and stock history

## Tech Stack

### Frontend

- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React (icons)

### Backend

- Node.js with Express
- SQLite (development)
- Prisma ORM
- TypeScript
- RESTful API endpoints

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── admin/        # Admin-specific components
│   │   │   ├── cart/         # Cart components
│   │   │   ├── checkout/     # Checkout components
│   │   │   └── product/      # Product components
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── cart/         # Cart page
│   │   │   ├── checkout/     # Checkout page
│   │   │   └── product/      # Product pages
│   │   ├── types/            # TypeScript types
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
│   └── package.json
├── server/                 # Backend API
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   └── index.ts          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Seed script
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AmanSinghNp/ASD-App.git
   cd ASD-App
   ```

2. **Install all dependencies (recommended):**

   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Set up the database:**

   ```bash
   cd server
   
   # The .env file should already be created with DATABASE_URL="file:./dev.db"
   # If not, create it manually
   
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   
   # Seed the database with sample data
   npm run prisma:seed
   ```

4. **Start the application:**

   ```bash
   # From the root directory, start both frontend and backend
   npm run dev
   ```

   **Alternative - Start components separately:**
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend  
   npm run dev:client
   
   # Terminal 3 - Database GUI (optional)
   npm run prisma:studio
   ```

5. **Access the application:**
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:3000`
   - **Database GUI**: `http://localhost:5555` (Prisma Studio)

## Database Schema

### User

- `id`: Unique identifier (CUID)
- `email`: Unique email address
- `passwordHash`: Hashed password (placeholder for now)
- `role`: Enum (CUSTOMER, STAFF)
- `createdAt`, `updatedAt`: Timestamps

### Product

- `id`: Unique identifier (PROD-SKU-XXX format)
- `sku`: Unique stock keeping unit
- `name`: Product name
- `category`: Product category
- `priceCents`: Price in cents (integer)
- `stockQty`: Stock quantity
- `imageUrl`: Optional image URL
- `isActive`: Boolean status
- `createdAt`, `updatedAt`: Timestamps

### Cart

- `id`: Unique identifier (CUID)
- `userId`: Reference to User
- `status`: Enum (OPEN, CHECKED_OUT)
- `createdAt`, `updatedAt`: Timestamps

### CartItem

- `id`: Unique identifier (CUID)
- `cartId`: Reference to Cart
- `productId`: Reference to Product
- `quantity`: Item quantity
- `createdAt`, `updatedAt`: Timestamps

### Order

- `id`: Unique identifier (ORD-YYYYMMDD-XXX format)
- `userId`: Reference to User
- `deliveryMethod`: Delivery method selected
- `addressLine1`, `suburb`, `state`, `postcode`: Delivery address components
- `slotStart`, `slotEnd`: Delivery time slot
- `status`: Order status (Processing, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled)
- `totalCents`: Total order amount in cents
- `paymentMethod`: Payment method used
- `paymentStatus`: Payment status tracking
- `createdAt`, `updatedAt`: Timestamps

### OrderItem

- `id`: Unique identifier (CUID)
- `orderId`: Reference to Order
- `productId`: Reference to Product
- `nameAtPurchase`: Product name at time of purchase
- `priceCents`: Price at time of purchase
- `quantity`: Item quantity

### StockHistory

- `id`: Unique identifier (CUID)
- `productId`: Reference to Product
- `userId`: Reference to User (who made the change)
- `oldQuantity`: Previous stock quantity
- `newQuantity`: New stock quantity
- `changeType`: Type of change (purchase, restock, adjustment, admin_update)
- `reason`: Optional reason for the change
- `createdAt`: Timestamp

### OrderStatusHistory

- `id`: Unique identifier (CUID)
- `orderId`: Reference to Order
- `status`: Order status at this point in time
- `notes`: Optional notes about the status change
- `createdAt`: Timestamp

### FAQ

- `id`: Unique identifier (CUID)
- `question`: FAQ question
- `answer`: FAQ answer
- `category`: FAQ category (shipping, payment, account, products, general)
- `isActive`: Boolean status
- `createdAt`, `updatedAt`: Timestamps

### ChatSession

- `id`: Unique identifier (CUID)
- `userId`: Reference to User (customer who started chat)
- `status`: Chat status (open, closed, resolved)
- `subject`: Optional subject/topic
- `createdAt`, `updatedAt`: Timestamps

### ChatMessage

- `id`: Unique identifier (CUID)
- `sessionId`: Reference to ChatSession
- `senderType`: Type of sender (customer, staff, system)
- `senderName`: Name of sender
- `message`: Message content
- `createdAt`: Timestamp

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products

- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart

### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Admin

- `GET /api/admin/analytics` - Get sales analytics
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (admin only)

### Stock Management

- `GET /api/stock/history/:productId` - Get stock history for a product
- `POST /api/stock/adjust` - Adjust stock levels (admin only)
- `GET /api/stock/low` - Get products with low stock

### FAQ

- `GET /api/faq` - Get all active FAQs
- `GET /api/faq/category/:category` - Get FAQs by category
- `POST /api/faq` - Create new FAQ (admin only)
- `PUT /api/faq/:id` - Update FAQ (admin only)
- `DELETE /api/faq/:id` - Delete FAQ (admin only)

### Chat Support

- `GET /api/chat/sessions` - Get chat sessions (staff only)
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions/:id/messages` - Get chat messages
- `POST /api/chat/sessions/:id/messages` - Send message
- `PUT /api/chat/sessions/:id/status` - Update chat session status

## Seed Data

The database is seeded with comprehensive sample data:

- **Users**:
  - Staff: `staff@example.com` (password: `password123`)
  - Customer: `alice@example.com` (password: `password123`)
- **Products** (with legible IDs):
  - `PROD-APL-001`: Apple Gala 1kg (Fruits) - $4.50
  - `PROD-MLK-002`: Milk 2L (Dairy) - $3.90
  - `PROD-BRC-003`: Brown Rice 5kg (Pantry) - $16.90
  - `PROD-BAN-004`: Banana Bunch (Fruits) - $2.50
  - `PROD-BREAD-005`: Whole Wheat Bread (Bakery) - $3.20
  - `PROD-EGG-006`: Free Range Eggs 12pk (Dairy) - $6.80
  - `PROD-CHK-007`: Chicken Breast 1kg (Meat) - $12.00
  - `PROD-CAR-008`: Carrots 1kg (Vegetables) - $1.80
  - `PROD-POT-009`: Potatoes 2kg (Vegetables) - $3.50
  - `PROD-ONI-010`: Onions 1kg (Vegetables) - $2.20
- **Orders** (with legible IDs):
  - Multiple orders with IDs like `ORD-20251022-001`, `ORD-20251022-002`, etc.
  - Various order statuses: Processing, Packed, Out for Delivery, Delivered
  - Realistic delivery addresses across different Australian cities
- **FAQs**:
  - 5 sample FAQs covering shipping, payment, account, products, and general topics
- **Chat Sessions**:
  - Sample customer support chat with realistic conversation flow
- **Stock History**:
  - Complete audit trail of stock changes with reasons

## Performance Notes

- **Frontend**: Optimized React components with proper state management
- **Backend**: Efficient database queries with Prisma ORM
- **API**: RESTful endpoints with proper error handling
- **Database**: Indexed queries for fast product searches
- **Caching**: Client-side caching for improved performance

## Release 2.2 Features Status

### Completed Features

- ✅ User Management (F001) - Registration, login, profile management
- ✅ Product Catalogue (F004) - Product display, categories, sorting with legible IDs
- ✅ Admin Dashboard (F007) - Product management, analytics, order management
- ✅ Checkout/Payment (F003) - Payment processing, order confirmation with tracking
- ✅ Search & Filters (F005) - Product search, filtering, auto-complete
- ✅ Cart (F002) - Add/remove items, quantity management
- ✅ Delivery (F008) - Order tracking, delivery options, staff interface
- ✅ Stock Management (F006) - Real-time stock updates, audit trail, admin interface
- ✅ Customer Support Chat (F009) - Live chat system, staff interface, message history
- ✅ FAQ System (F010) - Comprehensive FAQ system with categories and admin management

### Enhanced Features in Release 2.2

- 🆕 **Legible ID Schemes** - Human-readable product and order IDs
- 🆕 **Comprehensive Database Schema** - Enhanced models with proper relationships
- 🆕 **Improved Package Management** - Fixed scripts and dependencies
- 🆕 **Enhanced Testing** - Comprehensive test suites for all features
- 🆕 **Better Error Handling** - Improved API responses and validation
- 🆕 **Performance Optimizations** - Database query optimization and caching

## Available Scripts

### Root Level Scripts
```bash
npm run dev              # Start both client and server
npm run dev:client       # Start only client
npm run dev:server       # Start only server
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with sample data
npm run prisma:generate  # Generate Prisma client
npm run build            # Build both client and server
npm run start            # Start production server
npm run test             # Run all tests
npm run test:client      # Run client tests
npm run test:server      # Run server tests
```

## Next Steps (Future Releases)

- Enhanced security and authentication with JWT tokens
- Real-time notifications with WebSocket support
- Advanced analytics and reporting dashboard
- Mobile app development (React Native)
- Performance optimization and caching strategies
- Integration with payment gateways
- Multi-language support
- Advanced search with Elasticsearch

## Troubleshooting

### Database Issues

- Ensure the `.env` file exists in the server directory with `DATABASE_URL="file:./dev.db"`
- Check that Prisma migrations are up to date: `npx prisma migrate status`
- Verify the database file exists: `server/dev.db`
- If database is corrupted, reset it: `npx prisma migrate reset`

### Frontend Issues

- Clear browser cache if components don't update
- Check console for TypeScript errors
- Ensure all dependencies are installed
- Check that the backend is running on `http://localhost:3000`

### Backend Issues

- Ensure the database is properly set up and seeded
- Check that all environment variables are set correctly
- Verify that Prisma client is generated: `npx prisma generate`
- Check server logs for detailed error messages

### Common Commands

```bash
# Reset database and reseed
cd server
npx prisma migrate reset --force
npm run prisma:seed

# Clear all caches and reinstall
cd ..
rm -rf node_modules client/node_modules server/node_modules
npm install
cd client && npm install
cd ../server && npm install

# Start the application
npm run dev

# Open database GUI
npm run prisma:studio

# Run tests
npm run test
```

### Port Conflicts

If you encounter port conflicts:
- **Frontend (5173)**: The app will automatically try port 5174 if 5173 is busy
- **Backend (3000)**: Stop other services using port 3000
- **Prisma Studio (5555)**: Stop other instances of Prisma Studio

## Team Members

- **Belinda Tjhin** (24754448) - User Management (F001), Order Logs (F010)
- **Vinix Collen** (25115294) - Cart (F002), Product Catalogue (F004)
- **Xiao Luo** (24671707) - Search & Filters (F005), Customer Support Chat (F009)
- **Danny Leung** (24750871) - Checkout/Payment (F003), Stock Management (F006)
- **Aman Singh** (25104201) - Admin Dashboard (F007), Delivery (F008)

## Course Information

- **Course**: 41026 Advanced Software Development
- **Assignment**: Project Release 1
- **Tutor**: Dr Hua Zuo
- **University**: University of Technology Sydney