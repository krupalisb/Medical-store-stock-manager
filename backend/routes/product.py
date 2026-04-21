from flask import Blueprint, request, jsonify
from database import supabase
from utils.helper import success

product_bp = Blueprint("product", __name__)

@product_bp.route("/products", methods=["GET"])
def get_products():
    products = supabase.table("products").select("*").execute()
    return jsonify(success(data=products.data))


@product_bp.route("/products", methods=["POST"])
def add_product():
    supabase.table("products").insert(request.json).execute()
    return jsonify(success("Product added"))


@product_bp.route("/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    supabase.table("products").delete().eq("id", product_id).execute()
    return jsonify(success("Product deleted"))