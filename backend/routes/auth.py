
import re

from flask import Blueprint, request, jsonify
from flask_login import (
    login_user,
    logout_user,
    login_required,
    current_user
)
from sqlalchemy.exc import IntegrityError

from models.user import User
from database import db
from utils.security import hash_password, verify_password


auth_bp = Blueprint("auth", __name__)


# ==========================================
# USER REGISTRATION
# ==========================================

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data."}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all(
        isinstance(value, str)
        for value in [name, email, password]
    ):
        return jsonify({"error": "All fields are required."}), 400

    name = name.strip()
    email = email.strip().lower()

    if not name or not email or not password:
        return jsonify({"error": "All fields are required."}), 400

    if len(name) > 100:
        return jsonify({
            "error": "Name must not exceed 100 characters."
        }), 400

    if len(email) > 120 or not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+", email
    ):
        return jsonify({
            "error": "Please enter a valid email address."
        }), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must contain at least 8 characters."
        }), 400

    # bcrypt supports a maximum of 72 password bytes.
    if len(password.encode("utf-8")) > 72:
        return jsonify({
            "error": "Password must not exceed 72 UTF-8 bytes."
        }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({
            "error": "Email is already registered."
        }), 409

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role="user"
    )

    try:
        db.session.add(user)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "error": "Email is already registered."
        }), 409

    return jsonify({
        "message": "Account created successfully!"
    }), 201


# ==========================================
# NORMAL USER LOGIN
# ==========================================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data."}), 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    email = email.strip().lower()

    user = User.query.filter_by(email=email, role="user").first()

    if not user or not user.is_active:
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    if not verify_password(password, user.password_hash):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    login_user(user)

    return jsonify({
        "message": "Login successful!",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })


# ==========================================
# ADMIN LOGIN
# ==========================================

@auth_bp.route("/admin-login", methods=["POST"])
def admin_login():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid request data."}), 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({
            "error": "Invalid admin credentials."
        }), 401

    email = email.strip().lower()

    admin = User.query.filter_by(
        email=email,
        role="admin"
    ).first()

    if not admin or not admin.is_active:
        return jsonify({
            "error": "Invalid admin credentials."
        }), 401

    if not verify_password(password, admin.password_hash):
        return jsonify({
            "error": "Invalid admin credentials."
        }), 401

    login_user(admin)

    return jsonify({
        "message": "Administrator login successful!",
        "user": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
            "role": admin.role
        }
    })


# ==========================================
# USER LOGOUT
# ==========================================

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():

    logout_user()

    return jsonify({
        "message": "Logged out successfully!"
    })


# ==========================================
# CURRENT USER DETAILS
# ==========================================

@auth_bp.route("/me", methods=["GET"])
@login_required
def get_current_user():

    return jsonify({
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    })
