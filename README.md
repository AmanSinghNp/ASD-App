# ASD Project - Release 1

This release implements core e-commerce functionality including User Management, Cart functionality, Checkout/Payment system, Product Catalogue, Search & Filters, Admin Dashboard, and Delivery tracking for the ASD (Advanced Software Development) project.

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
- **Order Tracking**: Real-time order status updates
- **Delivery Notifications**: Status change notifications

### Database Setup

- **SQLite Database**: Development database with Prisma ORM
- **Entity Models**: User, Product, Cart, CartItem, Order with proper relations
- **Seed Data**: Initial data including staff user, customer, products, and sample orders

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
├── client/                   # React frontend
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

1. **Install client dependencies:**

   ```bash
   cd client
   npm install
   ```

2. **Install server dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Set up the database:**

   ```bash
   cd server
   # Set environment variable for Windows PowerShell
   $env:DATABASE_URL="file:./dev.db"

   # Run database migration
   npx prisma migrate dev --name init

   # Seed the database
   npm run db:seed
   ```

4. **Start the backend server:**

   ```bash
   cd server
   npm run dev
   ```

5. **Start the frontend development server:**

   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173` to access the application

## Database Schema

### User

- `id`: Unique identifier (CUID)
- `email`: Unique email address
- `passwordHash`: Hashed password (placeholder for now)
- `role`: Enum (CUSTOMER, STAFF)
- `createdAt`, `updatedAt`: Timestamps

### Product

- `id`: Unique identifier (CUID)
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

- `id`: Unique identifier (CUID)
- `userId`: Reference to User
- `status`: Enum (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `totalCents`: Total order amount in cents
- `shippingAddress`: Delivery address
- `paymentMethod`: Payment method used
- `createdAt`, `updatedAt`: Timestamps

### OrderItem

- `id`: Unique identifier (CUID)
- `orderId`: Reference to Order
- `productId`: Reference to Product
- `quantity`: Item quantity
- `priceCents`: Price at time of purchase
- `createdAt`, `updatedAt`: Timestamps

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

## Seed Data

The database is seeded with:

- **Users**:
  - Staff: `staff@example.com` (password: `password123`)
  - Customer: `alice@example.com` (password: `password123`)
- **Products**:
  - Apple Gala 1kg (Fruits) - $4.50
  - Milk 2L (Dairy) - $3.20
  - Brown Rice 5kg (Pantry) - $12.00
  - Banana 1kg (Fruits) - $2.80
  - Bread Wholemeal (Bakery) - $3.50
- **Cart**: Sample cart for Alice with 2 apples
- **Orders**: Sample completed orders for testing

## Performance Notes

- **Frontend**: Optimized React components with proper state management
- **Backend**: Efficient database queries with Prisma ORM
- **API**: RESTful endpoints with proper error handling
- **Database**: Indexed queries for fast product searches
- **Caching**: Client-side caching for improved performance

## Release 1 Features Status

### Completed Features

- ✅ User Management (F001) - Registration, login, profile management
- ✅ Product Catalogue (F004) - Product display, categories, sorting
- ✅ Admin Dashboard (F007) - Product management, basic analytics
- ✅ Checkout/Payment (F003) - Payment processing, order confirmation
- ✅ Search & Filters (F005) - Product search, filtering, auto-complete
- ✅ Cart (F002) - Add/remove items, quantity management
- ✅ Delivery (F008) - Order tracking, delivery options

### In Progress Features

- 🔄 Order Logs (F010) - Order history tracking
- 🔄 Customer Support Chat (F009) - FAQ and chat functionality
- 🔄 Stock Management (F006) - Real-time stock updates

## Next Steps (Release 2)

- Complete remaining features (F006, F009, F010)
- Enhanced security and authentication
- Real-time notifications
- Advanced analytics and reporting
- Mobile app development
- Performance optimization

## Troubleshooting

### Database Issues

- Ensure SQLite is properly installed
- Check that the `.env` file exists in the server directory
- Verify the DATABASE_URL is set correctly

### Frontend Issues

- Clear browser cache if components don't update
- Check console for TypeScript errors
- Ensure all dependencies are installed

### Common Commands

```bash
# Reset database
cd server
rm dev.db
npx prisma migrate dev --name init
npm run db:seed

# Clear client cache
cd client
rm -rf node_modules
npm install

# Start both frontend and backend
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

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
