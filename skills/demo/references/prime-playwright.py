"""Prime Agent persistent-IPython reference; adapt explicit URLs/selectors only."""
from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path


def union_crop(before: dict, after: dict, viewport: dict, padding: int = 32) -> dict:
    left = max(0, min(before["x"], after["x"]) - padding)
    top = max(0, min(before["y"], after["y"]) - padding)
    right = min(viewport["width"], max(before["x"] + before["width"], after["x"] + after["width"]) + padding)
    bottom = min(viewport["height"], max(before["y"] + before["height"], after["y"] + after["height"]) + padding)
    width, height = right - left, bottom - top
    if width / height < 16 / 9:
        width = height * 16 / 9
    else:
        height = width * 9 / 16
    width = min(viewport["width"], math.floor(width / 16) * 16)
    height = min(viewport["height"], math.floor(width * 9 / 16))
    width = math.floor(height * 16 / 9)
    center_x, center_y = (left + right) / 2, (top + bottom) / 2
    x = max(0, min(math.floor(center_x - width / 2 + 0.5), viewport["width"] - width))
    y = max(0, min(math.floor(center_y - height / 2 + 0.5), viewport["height"] - height))
    return {"x": x, "y": y, "width": width, "height": height}


def record_shot(
    url: str,
    selector: str,
    label: str,
    crop: dict,
    duration_ms: int,
    output: Path,
    *,
    scroll: dict | None = None,
    action: str = "navigate",
) -> dict:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError as exc:
        raise RuntimeError(
            "Playwright is not guaranteed in Prime's kernel. Check the kernel first, "
            "then install Playwright and Chromium in the project environment if approved."
        ) from exc
    viewport = {"width": 1440, "height": 900}
    scroll = scroll or {"x": 0, "y": 0}
    video_dir = output.parent / ".video"
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(
            viewport=viewport,
            record_video_dir=str(video_dir),
            record_video_size=viewport,
        )
        page = context.new_page()
        page.clock.install(time="2026-01-01T00:00:00Z")
        page.goto(url, wait_until="domcontentloaded")
        page.evaluate("({x, y}) => scrollTo(x, y)", scroll)
        focus = page.locator(selector).first
        focus.wait_for(state="visible")
        bounds = focus.bounding_box()
        if bounds is None:
            raise RuntimeError(f"No bounding box for {selector!r}")
        page.evaluate(
            """({label, crop}) => {
              const node = document.createElement('div');
              node.textContent = label;
              Object.assign(node.style, {position:'fixed',top:`${crop.y + 24}px`,left:`${crop.x + 24}px`,
                zIndex:2147483647,background:'#111',color:'#fff',padding:'12px 18px',
                font:'bold 28px sans-serif',border:'3px solid #fff'});
              document.body.append(node);
            }""",
            {"label": label, "crop": crop},
        )
        page.mouse.move(bounds["x"] + bounds["width"] / 2, bounds["y"] + bounds["height"] / 2, steps=12)
        if action == "click":
            focus.click()
        elif action != "navigate":
            raise ValueError(f"unsupported shot action: {action}")
        page.clock.fast_forward(duration_ms)
        video = page.video
        context.close()
        video.save_as(str(output))
        browser.close()
        return bounds


def compose(ffmpeg_args: list[str]) -> None:
    if shutil.which("ffmpeg") is None:
        raise RuntimeError("ffmpeg is unavailable")
    if not ffmpeg_args or any(not isinstance(item, str) or "\x00" in item for item in ffmpeg_args):
        raise ValueError("invalid ffmpeg arguments")

    path_indexes = {index + 1 for index, item in enumerate(ffmpeg_args[:-1]) if item == "-i"}
    path_indexes.add(len(ffmpeg_args) - 1)
    for index in path_indexes:
        value = ffmpeg_args[index]
        if (
            not value
            or Path(value).is_absolute()
            or value.startswith("//")
            or "\\" in value
            or ":" in value
            or ".." in value.split("/")
        ):
            raise ValueError("ffmpeg paths must be safe relative paths")
    subprocess.run(["ffmpeg", *ffmpeg_args], check=True)
