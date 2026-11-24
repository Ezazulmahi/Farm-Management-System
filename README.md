A MERN stack web application for managing farms, agro-products, and activities.
The system allows users to explore farms, buy products, and track their profiles, while administrators can manage farms, products, and activities.

 Features
👨‍🌾 User Features

🔑 Authentication – Secure login & signup with role-based redirection.

🏡 Farm Listing – View available farms/agros with images.

🔍 Search & Filter – Search farms by name or category.

🛒 Cart System – Add products with unit tracking (instead of calories).

👤 User Profile – Manage and view personal info, orders, and activities.

ℹ️ About Page – Farm background, contact info, and activities.

🛠️ Admin Features

➕ Add Farm – Upload farms with images via admin panel.

❌ Delete Farm – Manage existing farms dynamically.

📢 Post Content – Add ads, about info, or announcements (editable).

📊 Dashboard – Track and manage all farms and users.

farm-management-system/
│
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose models
│   ├── routes/            # API endpoints
│   ├── uploads/           # Farm images
│   └── server.js          # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Profile, Farms, Admin Panel, Cart, About
│   │   ├── assets/        # Images & CSS
│   │   └── App.jsx        # Main React app
│   └── vite.config.js
│
└── README.md

## Running it locally

Requirements: Node.js 20 or newer and a MongoDB database (local `mongod` or a free MongoDB Atlas cluster).

1. Backend
   ```bash
   cd Backend
   npm install
   cp Model/.env.example Model/.env   # then fill in MONGO_URI and WEATHER_API_KEY
   npm start                          # http://localhost:5000
   ```
2. Frontend
   ```bash
   cd View
   npm install
   npm run dev                        # http://localhost:5173
   ```
3. First admin account. Sign up only offers the customer and farmer roles, so create the admin from the server:
   ```bash
   cd Backend
   # set ADMIN_EMAIL and ADMIN_PASSWORD in Model/.env first
   npm run create-admin
   ```

## Tests

```bash
cd Backend
npm test
```

The tests start a throwaway in-memory MongoDB (`mongodb-memory-server`), so they never touch your real database.

## Known gaps

- The API has no session or token check yet. Admin pages are hidden in the frontend only, so anyone who calls the API directly can edit or delete users, farms and products.
- `View/src/pages/Farms/Cattle.jsx` calls `/api/cattleranch` and `InventoryPage.jsx` calls `/api/products/:id/stock-history`. Neither endpoint exists in the backend.
- The frontend hardcodes `http://localhost:5000` as the API address in several files.
