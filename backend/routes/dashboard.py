from flask import Blueprint, jsonify
from database import supabase
from datetime import datetime, date
from utils.helper import success

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard-summary", methods=["GET"])
def summary():

    products = supabase.table("products").select("*").execute()
    purchases = supabase.table("purchases").select("*").limit(5).execute()
    sales = supabase.table("sales").select("*").execute()

    # Make product map safe
    product_map = {str(p["id"]): p for p in products.data}

    total_products = len(products.data)

    today = date.today()

    low_stock = []
    expired = []
    in_stock = []

    for p in products.data:
        qty = p.get("quantity", 0)
        expiry_date = p.get("expiry_date")

        expiry = None
        if expiry_date:
            try:
                expiry = datetime.fromisoformat(expiry_date).date()
            except:
                expiry = None

        if expiry and expiry < today:
            expired.append(p)

        if qty <= 10:
            low_stock.append(p)

        if qty > 10 and (not expiry or expiry >= today):
            in_stock.append(p)

    total_value = sum(
        p.get("quantity", 0) * (p.get("selling_price") or 0)
        for p in products.data
    )

    # Recent Purchases
    recent_purchases = []
    for purchase in purchases.data:
        pid = str(purchase["product_id"])
        product = product_map.get(pid)
        if product:
            recent_purchases.append({
                "product_name": product["product_name"],
                "quantity": purchase["quantity"],
                "total_amount": purchase["total_amount"]
            })

    # Top Selling
    sales_count = {}
    for sale in sales.data:
        pid = str(sale["product_id"])
        sales_count[pid] = sales_count.get(pid, 0) + sale["quantity"]

    top_selling_products = []
    sorted_sales = sorted(sales_count.items(), key=lambda x: x[1], reverse=True)[:5]

    for pid, qty in sorted_sales:
        product = product_map.get(pid)
        if product:
            top_selling_products.append({
                "product_name": product["product_name"],
                "quantity_sold": qty,
                "stock": product.get("quantity", 0)
            })

    return jsonify(success(data={
        "total_products": total_products,
        "in_stock": len(in_stock),
        "low_stock": len(low_stock),
        "expired_items": len(expired),
        "total_value": total_value,
        "recent_purchases": recent_purchases,
        "top_selling": top_selling_products,
        "low_stock_products": low_stock,
        "expired_products": expired
    }))