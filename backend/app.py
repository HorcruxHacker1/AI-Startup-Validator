
# ==========================================
# AI STARTUP VALIDATOR - FLASK APPLICATION
# ==========================================

# 1. Load environment variables FIRST
from dotenv import load_dotenv

load_dotenv()

# 2. Import required libraries
import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from flask_wtf.csrf import generate_csrf

# 3. Import project configuration and extensions
from config import Config
from database import db
from extensions import login_manager, csrf

# 4. Create Flask application
app = Flask(__name__)

# Load application configuration
app.config.from_object(Config)

# Check secret key
if not app.config.get("SECRET_KEY"):
    raise ValueError("SECRET_KEY not found in .env file")

# 5. Configure CORS for React frontend
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    supports_credentials=True
)

# 6. Initialize database and security extensions
db.init_app(app)

login_manager.init_app(app)

csrf.init_app(app)


# ==========================================
# USER SESSION MANAGEMENT
# ==========================================

@login_manager.user_loader
def load_user(user_id):

    from models.user import User

    try:
        return db.session.get(User, int(user_id))
    except (ValueError, TypeError):
        return None


@login_manager.unauthorized_handler
def unauthorized():

    return jsonify({
        "error": "Please log in to continue."
    }), 401


# ==========================================
# IMPORT DATABASE MODELS
# ==========================================

from models import (
    User,
    StartupIdea,
    AnalysisHistory,
    AuditLog
)


# ==========================================
# IMPORT API ROUTES
# ==========================================

from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.analysis import analysis_bp


# ==========================================
# REGISTER BLUEPRINTS
# ==========================================

app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)

app.register_blueprint(
    analysis_bp,
    url_prefix="/api"
)


# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/")
def home():

    return jsonify({
        "message": "AI Startup Validator Backend is running!"
    })


# ==========================================
# CSRF TOKEN ROUTE
# ==========================================

@app.route("/api/csrf-token", methods=["GET"])
def get_csrf_token():

    return jsonify({
        "csrf_token": generate_csrf()
    })


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

with app.app_context():

    db.create_all()


# ==========================================
# RUN FLASK APPLICATION
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )
