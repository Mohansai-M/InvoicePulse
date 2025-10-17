# Invoice Uploader – Technical Assessment

A web application to upload invoices (PDF/JPG/PNG), extract structured data using an LLM, and store it in a database. Users can review, edit, and manage uploaded invoices through a simple and intuitive interface.

---

## Features

- **Authentication & Security**
  - User login/signup with **JWT** authentication
  - Password hashing using **bcrypt**
  - Basic rate-limiting to prevent abuse

- **File Upload & Storage**
  - Supports PDF, JPG, PNG (≤10MB)
  - Files stored in **local storage**

- **Data Extraction**
  - **Multi-provider LLM abstraction**:
    - Images → **OpenAI API**
    - PDFs → **pdf-parse**
  - Structured extraction validated using **Yup** schemas

- **Invoice Management**
  - Review, edit, and save extracted invoice data
  - View all uploaded invoices

- **API Endpoints**
  - Upload invoice
  - List all invoices
  - View invoice details
  - Update invoice data

---

## Tech Stack

- **Frontend:** React / Next.js  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **File Storage:** Local storage  
- **LLM / Extraction:** OpenAI API (images), pdf-parse (PDFs)  
- **Validation:** Yup  
- **Authentication:** JWT + bcrypt  

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd InvoicePulse
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a .env file in server/ with the following variables:
```bash
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
OPENAI_API_KEY=<your_openai_api_key>
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```


Create .env.local in client/ (if needed):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```
### 4. Run the Application

Backend:
```bash
cd ../server
npm start
```

Frontend:
```bash
cd ../client
npm run dev
```
