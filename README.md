# OverClockedX

**OverClockedX** is a modern e-commerce platform designed specifically for computer and hardware retail. It allows users to browse, search, and purchase components and peripherals from a streamlined and responsive web interface.

---

## Features

### Authentication
- Sign in using Google or email credentials  
- Sign up with Google or email credentials  
- Email verification sent during credential-based signup  
- Account activation required via email confirmation  
- Forgot password and reset password via email  

### Shopping Experience
- Browse and search computer components  
- Filter products in the product list (e.g., by category, price, or brand)  
- Click on products to view a preview with detailed information  
- View suggested products related to the one currently being previewed  
- View featured products (best-selling items) on the dashboard  
- View recently added promotions and discounts on the dashboard  
- Add, update, and remove items from shopping cart  
- Checkout all selected items in the cart or directly from the product preview  
- Apply vouchers during checkout, with discounts reflected based on voucher type (e.g., shipping vouchers)  
- View order history and tracking details  

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
- **Email Service:** [Nodemailer](https://nodemailer.com/)  
- **File Uploads:** [Edge Store](https://edgestore.dev/)  
- **UI Components:** [shadcn/ui](https://ui.shadcn.dev/)  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)  
- **Animations:** [Framer Motion](https://www.framer.com/motion/)  

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



