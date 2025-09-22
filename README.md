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
