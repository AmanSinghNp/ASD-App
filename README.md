# ASD Project - Iteration 0

This iteration implements a static Admin Dashboard UI and prototype database setup for the ASD (Advanced Software Development) project.

## Features Implemented

### Admin Dashboard Interface
- **Product Management**: View, add, edit, hide/unhide, and remove products
- **Filtering**: Search by name or SKU, filter by category and status
- **Pagination**: Client-side pagination with 25 items per page
- **Responsive Design**: Modern UI using Tailwind CSS and shadcn/ui components

### Database Setup
- **SQLite Database**: Development database with Prisma ORM
- **Entity Models**: User, Product, Cart, CartItem with proper relations
- **Seed Data**: Initial data including staff user, customer, products, and sample cart

## Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- React Router
- Lucide React (icons)

### Backend
- SQLite (development)
- Prisma ORM
- TypeScript

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/admin/  # Admin components
│   │   ├── pages/admin/        # Admin pages
│   │   ├── types/             # TypeScript types
│   │   └── lib/mock/          # Mock data
│   └── package.json
├── server/                 # Backend (database only for now)
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Seed script
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

4. **Start the development server:**
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` - you'll be redirected to the admin dashboard at `/admin`

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

## Admin Dashboard Features

### Product Table
- **Columns**: Name, SKU, Category, Price, Stock, Status, Actions
- **Actions**: Edit, Hide/Unhide, Remove
- **Price Display**: Formatted as currency (e.g., $4.50)
- **Status Badges**: Active (green) / Hidden (gray)

### Filters
- **Search**: By product name or SKU
- **Category**: Dropdown with available categories
- **Status**: Active/Hidden filter
- **Results Counter**: Shows current page items and total

### Modals
- **Product Form**: Add/Edit product with validation
- **Confirm Dialog**: Confirmation for delete actions
- **Accessibility**: Keyboard navigation (Escape to close)

### Local State Management
- All CRUD operations update local state only
- No API calls (as per iteration requirements)
- Data persists during session

## Seed Data

The database is seeded with:
- **Users**: 
  - Staff: `staff@example.com`
  - Customer: `alice@example.com`
- **Products**: 
  - Apple Gala 1kg (Fruits)
  - Milk 2L (Dairy)
  - Brown Rice 5kg (Pantry)
- **Cart**: Sample cart for Alice with 2 apples

## Performance Notes

- Admin table renders efficiently with client-side pagination
- Filters work on in-memory data for fast response
- Modal dialogs are optimized for accessibility

## Next Steps (Out of Scope for Iteration 0)

- Real authentication and authorization
- Live CRUD APIs with persistence
- Sales analytics and charts
- Delivery workflows
- Real-time updates

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
```



