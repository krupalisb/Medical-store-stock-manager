from database import supabase

def increase_stock(product_id, quantity):
    product = supabase.table("products").select("quantity").eq("id", product_id).execute()
    
    if not product.data:
        return False

    current = product.data[0]["quantity"]
    new_quantity = current + quantity

    supabase.table("products").update({
        "quantity": new_quantity
    }).eq("id", product_id).execute()

    return True


def decrease_stock(product_id, quantity):
    product = supabase.table("products").select("quantity").eq("id", product_id).execute()
    
    if not product.data:
        return False

    current = product.data[0]["quantity"]

    if quantity > current:
        return False

    new_quantity = current - quantity

    supabase.table("products").update({
        "quantity": new_quantity
    }).eq("id", product_id).execute()

    return True