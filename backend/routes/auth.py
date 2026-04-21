from flask import Blueprint, request, jsonify
from database import supabase
from utils.helper import success, error

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = supabase.table("users").select("*").eq("email", email).execute()

    if user.data and user.data[0]["password"] == password:
        return jsonify(success("Login successful", user.data[0]))

    return jsonify(error("Invalid credentials")), 401