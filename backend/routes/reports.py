from flask import Blueprint, jsonify
from database import supabase
from utils.helper import success

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/reports/monthly", methods=["GET"])
def monthly_report():
    sales = supabase.table("sales").select("*").execute()
    total = sum(float(s["total_amount"]) for s in sales.data)
    return jsonify(success(data={"monthly_sales": total}))