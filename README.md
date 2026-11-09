# SmartCRM – MERN Stack Customer Relationship Management Application

A full-stack Customer Relationship Management (CRM) application built with **MongoDB, Express.js, React, and Node.js**. SmartCRM enables authenticated users to organize customer details, manage customer statuses, search by location, and monitor customer statistics on a dashboard.

> **Project status:** Core customer management and login functionality have been tested locally. Public deployment has not yet been verified.

## Features

- User registration and login interface with JWT-based authentication
- Authenticated customer management with records scoped to their account
- Add, view, edit, and delete customer records
- Customer fields: full name, email, phone, company, address, city, state, pincode, status, and notes
- Customer status values: `lead`, `active`, and `inactive`
- Search by customer name, email, phone, company, and address/location details
- Filter customers by city, state, and pincode; clear filters
- Dashboard showing total customers, active customers, and new customers in the last 30 days
- MongoDB Atlas persistence, with timestamps for customer records
- API input validation and duplicate-email protection per account
- Responsive interface using Bootstrap styles

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, JavaScript, Bootstrap |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, protected routes |
| Validation | Zod |
| API Testing | Postman |
| Version Control | Git, GitHub |

## Project Structure

```text
SmartCRM/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Customers.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── controllers/
│   │   └── customerController.js
│   ├── models/
│   │   └── Customer.js
│   ├── routes/
│   │   └── customerRoutes.js
│   └── package.json
├── .gitignore
└── README.md
```

The structure shows verified or discussed key files rather than every file in the repository. Your actual backend entry point and authentication files may have different names.

## Prerequisites

- Node.js and npm
- MongoDB Atlas cluster and database connection string
- Postman (optional, for API tests)
- Git (for version control)

## Run Locally

### 1. Clone the repository

Once the project is uploaded, replace `YOUR_GITHUB_USERNAME` with your GitHub username:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/smartcrm-mern-stack.git
cd smartcrm-mern-stack
```

If the project is already on your computer, open its root directory instead.

### 2. Install backend dependencies

```bash
cd server
npm install
```

Create `server/.env` with your own values (do **not** commit it):

```dotenv
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Use the variable names expected by your existing backend. The values above reflect the configuration discussed during development.

Start the backend using the command defined by `server/package.json`, typically:

```bash
npm run dev
```

### 3. Install frontend dependencies

Open a second terminal at the project root:

```bash
cd client
npm install
npm run dev
```

Vite typically runs at **http://localhost:5173**. If your frontend requires an API base URL environment variable, configure it using the exact variable name referenced in `client/src/services/api.js`.

### 4. Open SmartCRM

Visit **http://localhost:5173** and register or log in with your account. The dashboard and customer management pages require authentication.

## Customer Data Model

| Field | Description |
| --- | --- |
| `owner` | Authenticated user ID associated with the record |
| `name` | Required customer full name |
| `email` | Required email; unique for each owner |
| `phone` | Phone number |
| `company` | Company name |
| `address` | Street/locality address |
| `city` | City |
| `state` | State |
| `pincode` | Indian six-digit PIN code, or blank |
| `status` | `lead`, `active`, or `inactive` |
| `notes` | Customer-related notes |
| `createdAt`, `updatedAt` | Automatically maintained timestamps |

## REST API Reference

Base URL for local testing: `http://localhost:5000`

| Method | Endpoint | Purpose | Successful status |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user | Depends on auth controller |
| `POST` | `/api/auth/login` | Authenticate and receive JWT | `200 OK` |
| `GET` | `/api/customers` | List signed-in user's customers | `200 OK` |
| `POST` | `/api/customers` | Create customer | `201 Created` |
| `GET` | `/api/customers/:id` | Retrieve one customer | `200 OK` |
| `PUT` | `/api/customers/:id` | Update a customer | `200 OK` |
| `DELETE` | `/api/customers/:id` | Delete a customer | `200 OK` |

Customer routes require JWT authorization:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

For requests with JSON bodies, send the `Content-Type: application/json` header. The current `PUT` implementation validates a complete customer object; include the required `name` and `email` fields.

### Example: Create Customer

```http
POST http://localhost:5000/api/customers
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

```json
{
  "name": "Sample Customer",
  "email": "sample.customer@example.com",
  "phone": "9000000099",
  "company": "Example Technologies",
  "address": "Gandhi Road",
  "city": "Ranipet",
  "state": "Tamil Nadu",
  "pincode": "632401",
  "status": "lead",
  "notes": "Fictional record for API testing"
}
```

The server returns a generated MongoDB `_id`. Use that ID for the single-customer GET, PUT, and DELETE endpoints.

## Postman Testing Results

The following API operations were tested successfully in Postman during local development:

| Test | Observed status | Result |
| --- | --- | --- |
| Login | `200 OK` | Passed |
| Get all customers | `200 OK` | Passed |
| Create customer | `201 Created` | Passed |
| Get customer by ID | `200 OK` | Passed |
| Update customer | `200 OK` | Passed |
| Delete customer | `200 OK` | Passed |

The temporary test customer was deleted after the CRUD tests. A subsequent dashboard check showed **6 total customers, 3 active customers, and 6 new customers in the last 30 days** in the local test data. These figures are testing evidence, not fixed application metrics.

**Additional checks recommended before deployment:** registration, invalid inputs, unauthenticated requests, cross-user access isolation, and production configuration.

## Screenshots

Add screenshots to a `screenshots/` directory before including them in the GitHub repository:

- `smartcrm-login.png`
- `smartcrm-dashboard.png`
- `smartcrm-customers.png`
- `smartcrm-location-filters.png`
- `smartcrm-postman-tests.png`

Avoid sharing live customer personal data, passwords, JWT tokens, or database connection strings in screenshots.

## Security Notes

- Keep `.env` files, passwords, access tokens, and private connection strings out of Git.
- Keep user-specific data protected by JWT authentication and server-side owner checks.
- Store passwords securely as hashes; never expose password fields in API responses.
- Configure `CLIENT_URL` and CORS for the production frontend URL when deploying.
- Rotate any secrets that have previously appeared in screenshots or shared logs before public deployment.
- Back up important data before changing production databases or collections.

## Deployment Plan

A possible deployment setup is:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Production deployment and the public URLs should be added to this README **only after** the application has been deployed and tested successfully.

## Learning Outcomes

This project demonstrates:

- Building a React frontend connected to Express REST APIs
- Implementing JWT-protected routes and account-specific data access
- Designing MongoDB/Mongoose customer records
- Validating API payloads with Zod
- Building CRUD operations and customer location filtering
- Testing endpoints using Postman
- Presenting customer metrics on a dashboard

## Author

**Nareshkumar S**  
AI Full Stack Developer (MERN)  
Entri Elevate – AI Enhanced Full Stack Development

GitHub: [nareshkumarshankarjo-ux](https://github.com/nareshkumarshankarjo-ux)

---

**SmartCRM** — A MERN Stack Customer Relationship Management learning project.