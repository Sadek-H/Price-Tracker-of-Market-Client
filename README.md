Price Tracker for Local Markets (Client) - Repository Details
**Live Demo:** [Add live demo link here]( https://kachabazzarprice.netlify.app)
**Client repo:** https://github.com/Sadek-H/Price-Tracker-of-Market-Client/tree/main/price-tracker%20for%20local%20markets
🚀 Project Overview
A responsive React client application that displays daily product prices from local markets, enables role-based dashboards (Admin / Vendor / User), and integrates Firebase authentication with JWT tokens for secure API access. Ideal for quickly comparing market prices and helping users make better buying decisions.
🧩 Main Features
- Firebase authentication (email/password + Google) + JWT handling for protected API routes
- Role-based UI: Admin, Vendor, User
- Market & product listings with daily price entries
- Add/update/delete (Vendor/Admin) product prices (client-side forms)
- Search, filter, and sort products by market/date/price
- Watchlist / Favorites for users
- Responsive layout (mobile → desktop)
- Smooth animations & toast notifications (for UX)
🛠️ Technologies & Tools
**Frontend**
- React
- Tailwind CSS
- React Router
- Axios
- Firebase (Auth)
- jwt-decode
**Optional Integrations / Analytics**
- Recharts or Chart.js for charts
- React Toastify for notifications
📦 Typical Dependencies
Replace with exact dependencies from your package.json:
- react
- react-router
- axios
- tailwindcss
- firebase
- react-toastify
- jwt-decode
⚙️ Environment Variables
Sample `.env` for client:
VITE_apiKey: import.meta.env.VITE_apiKey,
  VITE_authDomain: import.meta.env.VITE_authDomain,
 VITE_ projectId: import.meta.env.VITE_projectId,
  VITE_storageBucket: import.meta.env.VITE_storageBucket,
  VITE_messagingSenderId: import.meta.env.VITE_messagingSenderId,
  VITE_appId: import.meta.env.VITE_appId
🧭 Run Locally (Development)
1. Clone the repository:
   git clone https://github.com/Sadek-H/Price-Tracker-of-Market-Client.git
2. Navigate to the folder:
   cd 'price-tracker for local markets'
3. Install dependencies:
   npm install
4. Start development server:
   npm start (or npm run dev if using Vite)
🔧 Build & Deploy
1. Build the project:
   npm run build
2. Deploy the `build` folder to hosting platforms like Vercel, Netlify, or Firebase Hosting.
✉️ Contact
Sadek Hossen — 📧 sadek45st@gmail.com • 📞 +8801327177169
