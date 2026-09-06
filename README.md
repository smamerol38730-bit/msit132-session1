# MSIT 132 – Advanced Programming

## Final Capstone Project

### Pharmacy Inventory Monitoring and Drug Information Microservice

This repository contains my coursework and final capstone project for **MSIT 132 – Advanced Programming**.

The final project is a Flask-based REST API designed as a modular pharmacy microservice. It combines external drug information retrieval through the **openFDA API** with local pharmacy inventory analysis.

The microservice is designed to operate independently and may later be integrated into a larger pharmacy point-of-sale or inventory management system.

---

## Final Capstone

The complete source code is located in:

`final_capstone_pharmacy/`

The project provides the following features:

- Drug information retrieval using the openFDA API
- Inventory stock analysis
- Estimated days of available supply
- Estimated stockout date
- Estimated stockout day
- Automatic reorder determination
- Low-stock and sufficient-stock classification
- Input validation and error handling
- Web-based PharmaStock dashboard
- Dynamic medicine-form icons
- Docker containerization

---

## Project Structure

```text
final_capstone_pharmacy/
├── app.py
├── Dockerfile
├── README.md
├── requirements.txt
│
├── static/
│   ├── script.js
│   └── style.css
│
└── templates/
    └── index.html
```

---

## Main API Endpoints

The microservice provides two primary API endpoints together with supporting routes.

### Service Status

```http
GET /
```

Confirms that the Pharmacy Microservice is running.

Example response:

```json
{
  "message": "Pharmacy Microservice is running"
}
```

---

### Web Dashboard

```http
GET /dashboard
```

Opens the PharmaStock web interface used to interact with the drug information and inventory analysis functions.

Local address:

```text
http://127.0.0.1:5000/dashboard
```

---

### Drug Information Retrieval

```http
GET /api/drug/<name>
```

Retrieves available medicine information from the external **openFDA API**.

Example:

```text
/api/drug/Metformin
```

Depending on the information available from openFDA, the service may return:

- Generic name
- Brand name
- Dosage form
- Route of administration
- Manufacturer

Example response fields:

```json
{
  "generic_name": "Metformin Hydrochloride",
  "brand_name": "Metformin Hydrochloride",
  "dosage_form": "TABLET, FILM COATED",
  "route": ["ORAL"],
  "manufacturer": "Manufacturer information"
}
```

An internet connection is required for the openFDA drug-information feature.

---

### Inventory Stock Analysis

```http
POST /api/stock/check
```

Performs local inventory calculations using pharmacy stock information.

Example request:

```json
{
  "medicine": "Paracetamol 500mg",
  "current_stock": 20,
  "average_daily_sales": 5,
  "reorder_level": 25
}
```

The service evaluates:

- Current stock
- Average daily sales
- Reorder level
- Estimated days remaining
- Estimated stockout date
- Estimated stockout day
- Stock status
- Reorder requirement

For example, if the pharmacy has:

```text
Current Stock: 20 units
Average Daily Sales: 5 units/day
```

the estimated supply is:

```text
20 ÷ 5 = 4 days
```

The service then determines whether the medicine has sufficient stock or requires replenishment.

---

## Input Validation

The application includes validation for invalid or incomplete inventory information.

Examples include:

- Negative stock values
- Missing inventory fields
- Missing medicine names
- Invalid medicine searches
- Non-numeric stock values

Instead of allowing invalid data to continue through the computation, the microservice returns structured error responses.

---

## PharmaStock Dashboard

The project includes a graphical web interface called **PharmaStock**.

The dashboard provides:

- Drug Information Search
- Inventory Stock Checker
- Stock Status Display
- Estimated Supply
- Stockout Date Forecast
- Reorder Recommendation
- Validation and Error Messages
- Dynamic medicine icons based on dosage form
- Microservice and API status indicators

The dashboard acts as the user interface for the Flask microservice. The Flask API remains responsible for the backend processing.

---

## Technologies Used

The project uses the following technologies:

- **Python** – primary programming language
- **Flask** – backend web framework and REST API
- **REST API** – communication architecture
- **openFDA API** – external medicine information source
- **HTML** – dashboard structure
- **CSS** – dashboard styling and interface design
- **JavaScript** – frontend API communication and dynamic results
- **Docker** – application containerization
- **Postman** – API testing
- **Git** – version control
- **GitHub** – source-code repository

---

## Docker Containerization

The application is containerized using Docker to provide a consistent and isolated execution environment.

Docker packages the application together with its required runtime and dependencies. This makes it easier to run the microservice on another compatible computer without manually recreating the complete Python environment.

The Docker container exposes port:

```text
5000
```

and maps it to port `5000` on the host computer.

---

## Running the Final Project with Docker

### 1. Clone or download the repository

After obtaining the repository, open a terminal in the root directory:

```text
msit132-session1/
```

### 2. Build the Docker image

Run:

```bash
docker build -t pharmacy-microservice ./final_capstone_pharmacy
```

This creates a Docker image named:

```text
pharmacy-microservice
```

### 3. Run the Docker container

Run:

```bash
docker run --name pharmacy-capstone-final -p 5000:5000 pharmacy-microservice
```

The port mapping:

```text
5000:5000
```

connects port `5000` of the host computer to port `5000` inside the Docker container.

### 4. Open the dashboard

Open a web browser and visit:

```text
http://127.0.0.1:5000/dashboard
```

The PharmaStock dashboard should appear.

---

## Running from Inside the Project Folder

If the terminal is already inside:

```text
final_capstone_pharmacy/
```

the Docker image may instead be built using:

```bash
docker build -t pharmacy-microservice .
```

Then run:

```bash
docker run --name pharmacy-capstone-final -p 5000:5000 pharmacy-microservice
```

---

## Example Workflow

The overall application workflow is:

```text
User
  │
  ▼
PharmaStock Dashboard
  │
  ▼
Flask Microservice
  │
  ├───────────────► openFDA API
  │                  │
  │                  ▼
  │             Drug Information
  │
  └───────────────► Local Inventory Computation
                     │
                     ▼
                 Stock Status
                 Days Remaining
                 Stockout Date
                 Reorder Decision
```

---

## Purpose of the Microservice

The main purpose of the Pharmacy Inventory Monitoring and Drug Information Microservice is to provide two independent pharmacy-related functions in one modular service.

The first function retrieves medicine information from the external openFDA API.

The second function performs local inventory analysis to estimate how long current stock will last and whether replenishment is required.

Instead of functioning as a complete pharmacy management system, the project demonstrates how a smaller independent microservice can later be integrated into a larger point-of-sale or inventory architecture.

---

## Testing

The project was tested using both the web dashboard and Postman.

Test scenarios included:

- Successful medicine lookup
- Medicine not found
- Successful inventory analysis
- Low-stock condition
- Sufficient-stock condition
- Negative stock validation
- Missing inventory fields
- Empty medicine search
- Dockerized API execution

The Dockerized application was also tested using:

```text
GET /dashboard
GET /api/drug/Metformin
POST /api/stock/check
```

with successful HTTP `200` responses for valid requests.

---

## Deployment Note

The current implementation uses the Flask development server for academic demonstration and testing.

For a production deployment, debug mode should be disabled and the Flask application should be served through an appropriate production WSGI server.

---

## Future Improvements

Possible future improvements include:

- Connection to a relational pharmacy database
- Automatic retrieval of actual inventory records
- Expiry-date monitoring
- Supplier notifications
- Automatic reorder requests
- Historical sales analysis
- Predictive demand forecasting
- User authentication
- Role-based access
- Integration with a pharmacy point-of-sale system

---

## Final Capstone Documentation

More detailed project information is available inside:

`final_capstone_pharmacy/README.md`

---

## Course

**MSIT 132 – Advanced Programming**

**Final Capstone Project:**  
Pharmacy Inventory Monitoring and Drug Information Microservice