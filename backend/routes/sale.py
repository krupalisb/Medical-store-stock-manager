from flask import Blueprint, request, jsonify
from database import supabase
from services.stock_service import decrease_stock
from utils.helper import success, error

sale_bp = Blueprint("sale", __name__)

# 🔹 GET ALL SALES
@sale_bp.route("/sales", methods=["GET"])
def get_sales():
    sales = supabase.table("sales").select("*").execute()
    return jsonify(success(data=sales.data))


# 🔹 CREATE SALE
@sale_bp.route("/sale", methods=["POST"])
def create_sale():

    data = request.json
    product_id = data.get("product_id")
    quantity = int(data.get("quantity"))

    ok = decrease_stock(product_id, quantity)

    if not ok:
        return jsonify(error("Not enough stock or product not found")), 400

    supabase.table("sales").insert(data).execute()

    return jsonify(success("Sale successful"))