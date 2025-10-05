import json
from pathlib import Path
from fastapi.openapi.utils import get_openapi
from app.main import app


def main() -> None:
    spec = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    out = Path(__file__).resolve().parents[1] / "openapi.json"
    out.write_text(json.dumps(spec, indent=2))
    print(f"wrote {out}")


if __name__ == "__main__":
    main()


