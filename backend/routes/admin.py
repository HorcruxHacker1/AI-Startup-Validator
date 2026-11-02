from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from database import db
from models.user import User
from models.startup import StartupIdea
from models.analysis import AnalysisHistory

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/summary", methods=["GET"])
@login_required
def admin_summary():

    if current_user.role != "admin":
        return jsonify({
            "error": "Administrator access required."
        }), 403

    total_users = db.session.query(User).count()
    total_ideas = db.session.query(StartupIdea).count()
    total_analyses = db.session.query(AnalysisHistory).count()

    return jsonify({
        "total_users": total_users,
        "total_ideas": total_ideas,
        "total_analyses": total_analyses
    })