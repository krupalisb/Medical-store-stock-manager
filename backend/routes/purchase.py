from flask import Blueprint, request, jsonify
from database import supabase
from services.stock_service import increase_stock
from utils.helper import success, error

purchase_bp = Blueprint("purchase", __name__)

# 🔹 GET ALL PURCHASES
@purchase_bp.route("/purchases", methods=["GET"])
def get_purchases():
    purchases = supabase.table("purchases").select("*").execute()
    return jsonify(success(data=purchases.data))


# 🔹 CREATE PURCHASE
@purchase_bp.route("/purchase", methods=["POST"])
def create_purchase():

    data = request.json
    product_id = data.get("product_id")
    quantity = int(data.get("quantity"))

    ok = increase_stock(product_id, quantity)

    if not ok:
        return jsonify(error("Product not found")), 400

    supabase.table("purchases").insert(data).execute()

    return jsonify(success("Purchase successful"))