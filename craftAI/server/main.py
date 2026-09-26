import base64
import json
import os
import time
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

app = FastAPI()

PORT = int(os.environ.get("PORT", 3001))
WEB_URL = os.environ.get("WEB_URL", "http://localhost:3000")
TEMPLATES_DIR = Path(__file__).parent / "templates"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_URL],
    allow_methods=["POST"],
    allow_headers=["*"],
)


class RenderRequest(BaseModel):
    templateId: str
    fields: dict = {}
    format: str = "jpeg"
    preset: dict | None = None


@app.post("/render")
async def render(body: RenderRequest):
    template_path = TEMPLATES_DIR / f"{body.templateId}.json"
    if not template_path.exists():
        raise HTTPException(status_code=404, detail=f'Template "{body.templateId}" not found')

    template = json.loads(template_path.read_text())

    if not template.get("component"):
        raise HTTPException(
            status_code=400,
            detail="Only field-based templates support server-side rendering",
        )

    encoded_fields = base64.b64encode(json.dumps(body.fields).encode()).decode()
    render_url = f"{WEB_URL}/render/{body.templateId}?fields={encoded_fields}"

    preset = body.preset or {}
    target_width = preset.get("width", template["width"])
    target_height = preset.get("height", template["height"])
    fmt = "jpeg" if body.format == "jpeg" else "png"

    try:
        from playwright.async_api import async_playwright

        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
            )
            page = await browser.new_page()

            await page.set_viewport_size(
                {"width": template["width"] + 200, "height": template["height"] + 200}
            )

            await page.goto(render_url, wait_until="networkidle", timeout=30000)
            await page.wait_for_selector('[data-render-ready="true"]', timeout=15000)

            element = await page.query_selector("#render-target")
            if not element:
                raise RuntimeError("Render target element not found on page")

            if preset.get("width") and preset["width"] != template["width"]:
                scale = preset["width"] / template["width"]
                await page.evaluate(
                    """(s) => {
                        const target = document.getElementById('render-target');
                        if (target) {
                            const inner = target.firstElementChild;
                            if (inner) {
                                inner.style.transformOrigin = 'top left';
                                inner.style.transform = `scale(${s})`;
                            }
                            target.style.width = `${target.offsetWidth * s}px`;
                            target.style.height = `${target.offsetHeight * s}px`;
                            target.style.overflow = 'hidden';
                        }
                    }""",
                    scale,
                )
                await page.set_viewport_size(
                    {
                        "width": round(template["width"] * scale) + 100,
                        "height": round(template["height"] * scale) + 100,
                    }
                )

            screenshot_opts = {"type": fmt}
            if fmt == "jpeg":
                screenshot_opts["quality"] = 95

            image_bytes = await element.screenshot(**screenshot_opts)
            await browser.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Render failed: {str(e)}")

    ext = "jpg" if fmt == "jpeg" else "png"
    content_type = "image/jpeg" if fmt == "jpeg" else "image/png"
    filename = f"{body.templateId}-{int(time.time() * 1000)}.{ext}"

    return Response(
        content=image_bytes,
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
