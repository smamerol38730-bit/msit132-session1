from flask import Flask, jsonify, request, render_template
import requests
from datetime import date, timedelta
import math

app = Flask(__name__)


# -----------------------------------
# HOME / API STATUS
# -----------------------------------
@app.route("/")
def home():
    return jsonify({
        "message": "Pharmacy Microservice is running"
    })


# -----------------------------------
# PROTOTYPE DASHBOARD
# -----------------------------------
@app.route("/dashboard")
def dashboard():
    return render_template("index.html")

# -----------------------------------
# ENDPOINT 1: DRUG INFORMATION
# Uses the external openFDA API
# -----------------------------------
@app.route("/api/drug/<name>")
def get_drug(name):
    try:
        url = "https://api.fda.gov/drug/ndc.json"

        params = {
            "search": f'generic_name:"{name}"',
            "limit": 1
        }

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        if response.status_code == 404:
            return jsonify({
                "error": "Medicine not found"
            }), 404

        response.raise_for_status()

        data = response.json()
        drug = data["results"][0]

        return jsonify({
            "medicine_searched": name,
            "generic_name": drug.get(
                "generic_name",
                "Not available"
            ),
            "brand_name": drug.get(
                "brand_name",
                "Not available"
            ),
            "dosage_form": drug.get(
                "dosage_form",
                "Not available"
            ),
            "route": drug.get(
                "route",
                ["Not available"]
            ),
            "manufacturer": drug.get(
                "labeler_name",
                "Not available"
            )
        })

    except requests.RequestException:
        return jsonify({
            "error": "Unable to connect to the external drug API"
        }), 503

    except (KeyError, IndexError):
        return jsonify({
            "error": "Medicine information could not be found"
        }), 404


# -----------------------------------
# ENDPOINT 2: STOCK CHECKER
# Performs local computation
# -----------------------------------
@app.route("/api/stock/check", methods=["POST"])
def check_stock():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "No JSON data provided"
        }), 400

    required_fields = [
        "medicine",
        "current_stock",
        "average_daily_sales",
        "reorder_level"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "error": f"Missing required field: {field}"
            }), 400

    try:
        current_stock = float(data["current_stock"])
        average_daily_sales = float(
            data["average_daily_sales"]
        )
        reorder_level = float(data["reorder_level"])

        # -----------------------------
        # VALIDATION
        # -----------------------------
        if current_stock < 0:
            return jsonify({
                "error": "Current stock cannot be negative"
            }), 400

        if average_daily_sales <= 0:
            return jsonify({
                "error":
                "Average daily sales must be greater than zero"
            }), 400

        if reorder_level < 0:
            return jsonify({
                "error": "Reorder level cannot be negative"
            }), 400

        # -----------------------------
        # LOCAL COMPUTATION
        # -----------------------------
        days_remaining = (
            current_stock / average_daily_sales
        )

        days_until_stockout = math.ceil(
            days_remaining
        )

        today = date.today()

        stockout_date = today + timedelta(
            days=days_until_stockout
        )

        stockout_day = stockout_date.strftime("%A")

        # -----------------------------
        # STOCK STATUS
        # -----------------------------
        if current_stock <= reorder_level:
            stock_status = "LOW STOCK"
            reorder_required = True
        else:
            stock_status = "SUFFICIENT STOCK"
            reorder_required = False

        # -----------------------------
        # RESPONSE
        # -----------------------------
        return jsonify({
            "medicine": data["medicine"],
            "current_stock": current_stock,
            "average_daily_sales":
                average_daily_sales,
            "reorder_level": reorder_level,

            "estimated_days_remaining":
                round(days_remaining, 2),

            "estimated_stockout_date":
                stockout_date.strftime("%Y-%m-%d"),

            "estimated_stockout_day":
                stockout_day,

            "stock_status":
                stock_status,

            "reorder_required":
                reorder_required,

            "message":
                f"Based on current sales, "
                f"{data['medicine']} is expected "
                f"to run out around {stockout_day}, "
                f"{stockout_date.strftime('%B %d, %Y')}."
        })

    except (ValueError, TypeError):
        return jsonify({
            "error": "Stock values must be numeric"
        }), 400


# -----------------------------------
# START FLASK APPLICATION
# -----------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)