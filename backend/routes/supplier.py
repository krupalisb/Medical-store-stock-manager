from flask import Blueprint, jsonify, request
from database import supabase
from utils.helper import success

supplier_bp = Blueprint("supplier", __name__)

# GET suppliers
@supplier_bp.route("/suppliers", methods=["GET"])
def get_suppliers():
    suppliers = supabase.table("suppliers").select("*").execute()
    return jsonify(success(data=suppliers.data))


# POST supplier
@supplier_bp.route("/suppliers", methods=["POST"])
def create_supplier():

    data = request.json

    supabase.table("suppliers").insert({
        "supplier_name": data.get("supplier_name"),
        "phone": data.get("phone"),
        "email": data.get("email")
    }).execute()

    return jsonify({"message": "Supplier added successfully"})