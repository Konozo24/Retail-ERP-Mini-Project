# Retail ERP Mini Project

A full-stack Enterprise Resource Planning (ERP) system designed for retail businesses to manage inventory, sales, purchases, and customer relationships.

##  Features

### Inventory Management
- **Product Management**: Create, update, and track products with categories
- **Stock Management**: Real-time inventory tracking with low stock alerts
- **Barcode Generation**: Print product barcodes for easy scanning

### Sales & Orders
- **Point of Sale (POS)**: Fast and intuitive sales interface
- **Sales Orders**: Complete sales order management system
- **Purchase Orders**: Manage supplier orders and track deliveries

### Customer & Supplier Management
- **Customer Database**: Track customer information and purchase history
- **Supplier Management**: Maintain supplier records and purchase history
- **Category Organization**: Organize products by categories with custom images

### Dashboard & Analytics
- **Real-time Dashboard**: View key metrics and business insights
- **Sales Analytics**: Track sales performance and trends
- **Inventory Reports**: Monitor stock levels and product performance

### User Management
- **Authentication & Authorization**: Secure login with Spring Security
- **User Management**: Role-based access control
- **Password Recovery**: Forgot password functionality via email

##  Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.5.8**
- **Spring Data JPA** for database operations
- **Spring Security** for authentication
- **MySQL 8** database
- **Maven** for dependency management

### Frontend
- **React 19** with **Vite**
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Recharts** for data visualization
- **jsPDF** for PDF generation

### DevOps
- **Docker & Docker Compose** for containerization
- **MySQL** database with persistent volumes

##  Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- Git (for cloning the repository)

##  Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Konozo24/Retail-ERP-Mini-Project.git
cd Retail-ERP-Mini-Project
```

### 2. Build Docker Images
```bash
docker compose build
```

### 3. Start All Services
```bash
# Normal mode (with logs)
docker compose up

# Detached mode (background)
docker compose up -d

# Start specific service
docker compose up backend
docker compose up frontend
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **MySQL**: localhost:3306

### 5. Stop Services
```bash
# Stop all services
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v
```

##  Database Access

### Login to MySQL Container
1. Ensure containers are running: `docker compose up`
2. Open Docker Desktop and select the MySQL container
3. Click the three dots → "Open in terminal"
4. Login to MySQL:
```bash
mysql -u user -p
# Password: password
```
5. Select database:
```sql
use retailerpdb;
show tables;
```

##  Project Structure

```
Retail-ERP-Mini-Project/
├── backend/                    # Spring Boot backend
│   ├── src/main/
│   │   ├── java/com/retailerp/
│   │   │   ├── auth/          # Authentication controllers
│   │   │   ├── config/        # Security & app configuration
│   │   │   ├── controller/    # REST API controllers
│   │   │   ├── model/         # JPA entities
│   │   │   ├── repository/    # Data access layer
│   │   │   └── service/       # Business logic
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── schema-mysql.sql
│   │       └── data-mysql.sql
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api/               # API service layer
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
└── compose.yaml               # Docker Compose configuration
```

##  Development

### Backend Development
The backend uses Spring Boot with auto-reload enabled. Changes to Java files will trigger automatic recompilation.

**Default Credentials:**
- Check the database seed files in `backend/src/main/resources/data-mysql.sql`

### Frontend Development
The frontend runs with Vite's hot module replacement (HMR) for instant updates during development.

**Running frontend locally (without Docker):**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
The backend uses Spring Profiles:
- `dev` - Development with H2 in-memory database
- `prod` - Production with MySQL (used in Docker)

Configure in `backend/src/main/resources/application-{profile}.properties`

##  Docker Configuration

The project uses Docker Compose with three services:
- **mysql**: MySQL 8 database with persistent storage
- **backend**: Spring Boot application (port 8080)
- **frontend**: React + Vite development server (port 5173)

**Volumes:**
- `db-data`: MySQL data persistence
- Maven cache: `.m2` directory for faster builds
- Live code mounting for hot reload

##  API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /forgot-password` - Password recovery

### Products & Inventory
- `GET /products` - List all products
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `GET /categories` - List categories

### Orders
- `GET /sales-order` - List sales orders
- `POST /sales-order` - Create sales order
- `GET /purchase-order` - List purchase orders
- `POST /purchase-order` - Create purchase order

### Customers & Suppliers
- `GET /customers` - List customers
- `POST /customers` - Create customer
- `GET /suppliers` - List suppliers
- `POST /suppliers` - Create supplier

### Dashboard
- `GET /dashboard` - Get dashboard metrics

## Team Contributors

- **Kelvin** 
- **Justin** 
- **Lw** 
- **Cheng** 
- **Ming Wei**



## Acknowledgments

- Built with Spring Boot and React
- Styled with Tailwind CSS
- Containerized with Docker
