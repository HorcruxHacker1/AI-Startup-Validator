from datetime import datetime, timezone
from database import db


class AnalysisHistory(db.Model):
    __tablename__ = "analysis_history"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    startup_id = db.Column(
        db.Integer,
        db.ForeignKey("startup_ideas.id"),
        nullable=False
    )

    market_potential = db.Column(db.Text)
    competition_analysis = db.Column(db.Text)
    strengths = db.Column(db.Text)
    weaknesses = db.Column(db.Text)
    viability_score = db.Column(db.Integer)
    recommendations = db.Column(db.JSON)

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    owner = db.relationship("User", backref="analysis_history")
    startup = db.relationship("StartupIdea", backref="analyses")