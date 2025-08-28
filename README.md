# ASD-App

### 1. Fork and Clone the Repository

```bash
# Fork this repository on GitHub first, then clone your fork
git clone https://github.com/YOUR_USERNAME/ASD-App.git
cd ASD-App
```

### 2. Install Dependencies

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

### 3. Environment Setup

Create environment files if needed:

```bash
# In the server directory
cd server
touch .env
```

Add any required environment variables to `server/.env` (check with the project maintainer for specific requirements).

### 4. Run the Application

#### Option A: Run Both Client and Server Together (Recommended)

```bash
# From the root directory
npm run dev
```

This will start both the client (React app) and server (Node.js) simultaneously using concurrently.

#### Option B: Run Separately

**Terminal 1 - Start the Server:**

```bash
cd server
npm run dev
```

**Terminal 2 - Start the Client:**

```bash
cd client
npm run dev
```

### 5. Access the Application

- **Frontend (React)**: http://localhost:5173
- **Backend (API)**: http://localhost:3000 (or check server logs for actual port)
