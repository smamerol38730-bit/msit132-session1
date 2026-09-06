# MSIT 132 – Advanced Programming Final Capstone

## Pharmacy Inventory Monitoring and Drug Information Microservice

This repository contains my final capstone project for MSIT 132 – Advanced Programming.

The project is a Flask-based REST API designed as a modular pharmacy microservice. It provides two main functions:

- Drug information retrieval through the openFDA API
- Local pharmacy inventory analysis and stockout forecasting

The application also includes a web-based dashboard for interacting with the microservice and is containerized using Docker for consistent deployment.

---

## Final Capstone Source Code

The complete project is located in:

`final_capstone_pharmacy/`

### Project Structure

```text
final_capstone_pharmacy/
├── app.py
├── Dockerfile
├── README.md
├── requirements.txt
├── static/
│   ├── script.js
│   └── style.css
└── templates/
    └── index.html