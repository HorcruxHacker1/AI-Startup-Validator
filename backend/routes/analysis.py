
import json
import os

from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from google import genai
from google.genai import types

from database import db
from models.startup import StartupIdea
from models.analysis import AnalysisHistory


analysis_bp = Blueprint("analysis", __name__)

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None


@analysis_bp.route("/analyze", methods=["POST"])
@login_required
def analyze_idea():

    if client is None:
        return jsonify({
            "error": "AI service is unavailable."
        }), 503

    data = request.get_json(silent=True) or {}
    idea = data.get("idea", "")

    if not isinstance(idea, str) or not idea.strip():
        return jsonify({
            "error": "Please enter a valid startup idea."
        }), 400

    idea = idea.strip()

    if len(idea) > 5000:
        return jsonify({
            "error": "Startup idea must not exceed 5000 characters."
        }), 400

    prompt = f"""
    Analyze this startup idea:

    {idea}

    Evaluate it realistically and provide:
    1. Market potential
    2. Competition analysis
    3. Strengths
    4. Weaknesses
    5. Viability score from 0 to 100
    6. Five practical recommendations

    Do not invent market statistics or claim that research
    has been conducted. Clearly mention when information
    is uncertain.

    Return the results in the required JSON format.
    """

    schema = {
        "type": "OBJECT",
        "properties": {
            "market_potential": {"type": "STRING"},
            "competition_analysis": {"type": "STRING"},
            "strengths": {"type": "STRING"},
            "weaknesses": {"type": "STRING"},
            "viability_score": {"type": "INTEGER"},
            "recommendations": {
                "type": "ARRAY",
                "items": {"type": "STRING"}
            }
        },
        "required": [
            "market_potential",
            "competition_analysis",
            "strengths",
            "weaknesses",
            "viability_score",
            "recommendations"
        ]
    }

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=schema,
                temperature=0.4
            )
        )

        result = json.loads(response.text)

        score = result.get("viability_score")

        if (
            isinstance(score, bool)
            or not isinstance(score, int)
            or not 0 <= score <= 100
        ):
            return jsonify({
                "error": "AI returned an invalid viability score."
            }), 500

        startup = StartupIdea(
            user_id=current_user.id,
            title=idea[:200],
            description=idea
        )

        db.session.add(startup)
        db.session.flush()

        history = AnalysisHistory(
            user_id=current_user.id,
            startup_id=startup.id,
            market_potential=result["market_potential"],
            competition_analysis=result["competition_analysis"],
            strengths=result["strengths"],
            weaknesses=result["weaknesses"],
            viability_score=score,
            recommendations=result["recommendations"]
        )

        db.session.add(history)
        db.session.commit()

        return jsonify({
            "message": "Startup idea analyzed successfully!",
            "idea": idea,
            "analysis": result
        })

    except Exception as error:
        db.session.rollback()
        print("Gemini Analysis Error:", error)

        return jsonify({
            "error": "Unable to analyze the startup idea. Please try again."
        }), 500


@analysis_bp.route("/history", methods=["GET"])
@login_required
def get_analysis_history():

    history = (
        AnalysisHistory.query
        .filter_by(user_id=current_user.id)
        .order_by(AnalysisHistory.created_at.desc())
        .all()
    )

    return jsonify({
        "history": [
            {
                "id": item.id,
                "startup_id": item.startup_id,
                "title": item.startup.title,
                "viability_score": item.viability_score,
                "created_at": item.created_at.isoformat()
            }
            for item in history
        ]
    })


@analysis_bp.route("/history/<int:history_id>", methods=["GET"])
@login_required
def get_analysis_report(history_id):

    report = AnalysisHistory.query.filter_by(
        id=history_id,
        user_id=current_user.id
    ).first()

    if not report:
        return jsonify({
            "error": "Report not found."
        }), 404

    return jsonify({
        "id": report.id,
        "startup": {
            "id": report.startup.id,
            "title": report.startup.title,
            "description": report.startup.description
        },
        "analysis": {
            "market_potential": report.market_potential,
            "competition_analysis": report.competition_analysis,
            "strengths": report.strengths,
            "weaknesses": report.weaknesses,
            "viability_score": report.viability_score,
            "recommendations": report.recommendations
        },
        "created_at": report.created_at.isoformat()
    })
