from datetime import date
from database import supabase

def get_low_stock_products():
    return supabase.table("products").select("*").lte("quantity", 10).execute()

def get_expired_products():
    return supabase.table("products").select("*").lte("expiry_date", str(date.today())).execute()