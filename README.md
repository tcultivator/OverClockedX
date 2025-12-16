# OverClockedX

**OverClockedX** is an e-commerce website where you can purchase computers, laptops, computer parts, peripherals, and much more. It features an AI assistant that helps you check compatibility and provides relevan information to ensure you make informed decisions. With its responsive design and clean, user-friendly interface, OverClockedX offers an easy and seamless browseing experience across all device

---

## Features

### Authentication
- Sign in with Google or email + password
- Sign up with Google or email
- Email verification for credential-based signup
- Account activation required via verification link
- Forgot password + secure reset via email  

### Shopping Experience
- Browse and search PC components and peripherals
- Product filtering (category, brand, price, specs, etc.)
- Detailed product preview with images, specs, and stock
- Suggested/related product recommendations
- Featured products (best-sellers) on the dashboard
- Display promotions and discounted items
- Add, update, or remove cart items
- Checkout from cart or directly from a product page
- Voucher support (e.g., shipping vouchers, discount vouchers)
- View order history and shipment tracking
- Cancel Order (based on allowed status conditions)

### AI Assistant — TechMate
Your built-in AI chatbot designed to assist users with:
- Hardware recommendations
- Compatibility checks
- Troubleshooting
- Product comparisons
- Personalized suggestions
TechMate enhances the shopping experience by offering real-time AI guidance.

### Newsletter System
Users can subscribe to OverClockedX newsletters to receive:
- Product promotions
- New arrivals
Delivered via email for instant updates.

### User Profile
- View and update profile information (username, contact number, address, and profile picture)  
- View purchase history  

### UX & Design
- Fully responsive design for desktop, tablet, and mobile  
- Modern and clean UI for seamless shopping experience  

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (built on [React](https://reactjs.org/)) with TypeScript  
- **Authentication:** [Auth.js](https://authjs.dev/) (Google and Credentials providers)  
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)  
- **Payments:** [Xendit](https://www.xendit.co/) (GCash integration)  
- **Email Service:** [sendGrid](https://sendgrid.com/en-us)  
- **File Uploads:** [Edge Store](https://edgestore.dev/)  
- **UI Components:** [shadcn/ui](https://ui.shadcn.dev/)  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)  
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **BarCode Lookup:**  [barcodelookup](https://www.barcodelookup.com/)
- **OpenAi**  [OpenAi](https://openai.com/)
---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/overclockedx.git

# Change into the project directory (update folder name if different)
cd overclockedx

# Install dependencies
npm install

# Copy the example environment variables file to .env.local
cp .env.example .env.local

# Start the development server
npm run dev



