from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import tabular, lightcurve


app = FastAPI(
    title="Armana Exoplanet Backend",
    version="0.1.0",
    description="Tabular and light-curve analysis APIs",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok"}


app.include_router(tabular.router, prefix="/v1/tabular", tags=["tabular"])
app.include_router(lightcurve.router, prefix="/v1/lightcurve", tags=["lightcurve"])
