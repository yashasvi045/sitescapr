"""
main.py
-------
FastAPI application entry point for SiteScapr backend.

Run with:
    uvicorn app.main:app --reload --port 8000

CORS is open for local development (localhost:3000).
Tighten origins before any public deployment.
"""

import os
import uuid
import razorpay
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .schemas import AnalyzeRequest, AnalyzeResponse, IndexDeltaUpdate
from .scoring_engine import rank_areas, KOLKATA_AREAS
from .database import init_db, get_areas, apply_delta, get_last_pipeline_run

load_dotenv()


def _parse_cors_origins() -> list[str]:
    """Parse comma-separated CORS origins from env with sensible defaults."""
    raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,https://sitescapr.vercel.app",
    )
    origins = [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]
    return origins or ["http://localhost:3000"]

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
CORS_ORIGINS = _parse_cors_origins()
ALLOW_ALL_ORIGINS = CORS_ORIGINS == ["*"]

app = FastAPI(
    title="SiteScapr API",
    description="AI-powered business location scoring engine for Kolkata.",
    version="0.1.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=not ALLOW_ALL_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.on_event("startup")
def startup_event() -> None:
    """
    Initialise the SQLite database and seed it with static area data
    if the table is empty. Runs automatically on every server start.
    """
    init_db()
    db_areas = get_areas()
    if not db_areas:
        from .seed import seed
        seed()


@app.get("/")
def health_check():
    """Basic health check endpoint."""
    return {"status": "ok", "service": "SiteScapr API v0.1.0"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    """
    Core analysis endpoint.

    Accepts business parameters, scores all Kolkata neighborhoods
    against the weighted formula, applies budget filter, and returns
    the top 5 ranked recommendations with reasoning.
    """
    # Use live DB indices; fall back to static dataset if DB is empty.
    db_areas = get_areas()
    active_areas = db_areas if db_areas else KOLKATA_AREAS

    try:
        results = rank_areas(
            business_type=request.business_type,
            target_demographic=request.target_demographic,
            budget_range=request.budget_range,
            areas=active_areas,
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again.")

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No suitable areas found within the given budget range. Try increasing your budget.",
        )

    return AnalyzeResponse(
        results=results,
        business_type=request.business_type,
        total_areas_analyzed=len(active_areas),
    )


# ── Pipeline: n8n update endpoint ────────────────────────────────────────────

@app.post("/internal/update-indices")
def update_indices(
    payload: IndexDeltaUpdate,
    x_pipeline_secret: str = Header(None, alias="X-Pipeline-Secret"),
) -> dict:
    """
    Called by the n8n pipeline every 12 hours to apply news-derived
    index deltas to a neighbourhood. Protected by a shared secret header.
    """
    expected = os.getenv("PIPELINE_SECRET", "")
    if x_pipeline_secret != expected:
        raise HTTPException(status_code=403, detail="Forbidden: invalid pipeline secret.")

    deltas = {
        "income_index_delta":                    payload.income_index_delta,
        "foot_traffic_proxy_delta":              payload.foot_traffic_proxy_delta,
        "population_density_index_delta":        payload.population_density_index_delta,
        "competition_index_delta":               payload.competition_index_delta,
        "commercial_rent_index_delta":           payload.commercial_rent_index_delta,
        "accessibility_penalty_delta":           payload.accessibility_penalty_delta,
        "area_growth_trend_delta":               payload.area_growth_trend_delta,
        "vacancy_rate_improvement_delta":        payload.vacancy_rate_improvement_delta,
        "infrastructure_investment_index_delta": payload.infrastructure_investment_index_delta,
    }

    success = apply_delta(payload.area_name, deltas, payload.source_summary)
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Area '{payload.area_name}' not found in database.",
        )
    return {"status": "updated", "area": payload.area_name}


@app.get("/pipeline/last-run")
def pipeline_last_run() -> dict:
    """Returns metadata about the most recently updated neighbourhood."""
    info = get_last_pipeline_run()
    if not info:
        return {"last_updated": None, "area": None, "summary": "No pipeline runs recorded yet."}
    return info


# ── Razorpay ──────────────────────────────────────────────────────────────────

class CreateOrderRequest(BaseModel):
    plan: str = "pro"  # "pro" is the only paid plan for now


PLAN_AMOUNTS = {
    "pro": 59900,  # ₹599 in paise
}


@app.post("/create-order")
def create_order(body: CreateOrderRequest):
    """
    Creates a Razorpay order for the requested plan.
    Returns order_id, amount (paise), currency, and the public key_id.
    """
    amount = PLAN_AMOUNTS.get(body.plan)
    if amount is None:
        raise HTTPException(status_code=400, detail=f"Unknown plan: {body.plan}")

    try:
        order = rzp_client.order.create({
            "amount": amount,
            "currency": "INR",
            "receipt": f"sitescapr_{body.plan}_{uuid.uuid4().hex[:8]}",
            "notes": {"plan": body.plan},
        })
    except Exception:
        raise HTTPException(status_code=500, detail="Order creation failed. Please try again.")

    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "key_id": RAZORPAY_KEY_ID,
    }


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@app.post("/verify-payment")
def verify_payment(body: VerifyPaymentRequest):
    """
    Verifies the Razorpay HMAC-SHA256 payment signature.
    Must be called after a successful checkout to confirm the payment is genuine.
    """
    try:
        rzp_client.utility.verify_payment_signature({
            "razorpay_order_id": body.razorpay_order_id,
            "razorpay_payment_id": body.razorpay_payment_id,
            "razorpay_signature": body.razorpay_signature,
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Payment verification failed: invalid signature.")

    return {"verified": True, "payment_id": body.razorpay_payment_id}
