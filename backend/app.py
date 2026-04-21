from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.product import product_bp
from routes.supplier import supplier_bp
from routes.purchase import purchase_bp
from routes.sale import sale_bp
from routes.dashboard import dashboard_bp
from routes.reports import reports_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(product_bp, url_prefix="/api")
app.register_blueprint(supplier_bp, url_prefix="/api")
app.register_blueprint(purchase_bp, url_prefix="/api")
app.register_blueprint(sale_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(reports_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "Medical Store Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)