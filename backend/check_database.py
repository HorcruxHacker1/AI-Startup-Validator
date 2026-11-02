
from app import app
from models.startup import StartupIdea
from models.analysis import AnalysisHistory

with app.app_context():
    print("Total startup ideas:", StartupIdea.query.count())
    print("Total saved analyses:", AnalysisHistory.query.count())

    latest = AnalysisHistory.query.order_by(
        AnalysisHistory.id.desc()
    ).first()

    print("Latest analysis saved:", latest is not None)

    if latest:
        print("Latest analysis ID:", latest.id)
        print("Startup ID:", latest.startup_id)
