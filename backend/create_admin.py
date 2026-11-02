
from dotenv import load_dotenv
load_dotenv()

import os

from app import app
from database import db
from models.user import User
from utils.security import hash_password


admin_email = os.getenv("ADMIN_EMAIL")
admin_password = os.getenv("ADMIN_PASSWORD")

if not admin_email or not admin_password:
    raise ValueError("ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env")

admin_email = admin_email.strip().lower()

if len(admin_password) < 16:
    raise ValueError("Admin password must contain at least 16 characters.")

if len(admin_password.encode("utf-8")) > 72:
    raise ValueError("Admin password must not exceed 72 UTF-8 bytes.")

with app.app_context():

    existing_admin = User.query.filter_by(role="admin").first()

    if existing_admin:
        print("An administrator account already exists.")
    else:
        existing_user = User.query.filter_by(
            email=admin_email
        ).first()

        if existing_user:
            raise ValueError(
                "This email already belongs to an account. "
                "Choose a different admin email."
            )

        admin = User(
            name="Administrator",
            email=admin_email,
            password_hash=hash_password(admin_password),
            role="admin"
        )

        db.session.add(admin)
        db.session.commit()

        print("Administrator account created successfully!")
