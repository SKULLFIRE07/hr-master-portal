#!/usr/bin/env python3
"""Generate matching static PNG and SVG QR codes for an HTTPS portal URL."""

import argparse
from pathlib import Path
from urllib.parse import urlsplit

import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from qrcode.image.svg import SvgPathFillImage


def https_url(value: str) -> str:
    """Validate the URL while preserving the exact address encoded in the QR."""
    try:
        parsed = urlsplit(value)
        valid = parsed.scheme == "https" and parsed.hostname
    except ValueError:
        valid = False
    if not valid or any(character.isspace() for character in value):
        raise argparse.ArgumentTypeError("URL must be a complete HTTPS address.")
    return value


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", type=https_url, help="Final public HTTPS portal URL")
    parser.add_argument(
        "--output-dir", type=Path, default=Path("assets"),
        help="Directory for hr-portal-qr.png and hr-portal-qr.svg (default: assets)",
    )
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_Q, box_size=12, border=4)
    qr.add_data(args.url)
    qr.make(fit=True)
    png_path = args.output_dir / "hr-portal-qr.png"
    svg_path = args.output_dir / "hr-portal-qr.svg"
    qr.make_image(fill_color="black", back_color="white").save(png_path)
    qr.make_image(image_factory=SvgPathFillImage).save(svg_path)

    print(f"Encoded: {args.url}")
    print(f"Saved: {png_path}")
    print(f"Saved: {svg_path}")


if __name__ == "__main__":
    main()
