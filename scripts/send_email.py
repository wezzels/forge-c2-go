#!/usr/bin/env python3
"""
Reliable email sender using local Postfix
Saves emails to queue and handles retries automatically
"""

import subprocess
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path


def send_email(
    to: str,
    subject: str,
    body: str,
    from_addr: str = "wlrobbi@stsgym.com",
    attachments: list = None,
) -> bool:
    """
    Send email via local Postfix (reliable delivery).
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Plain text body
        from_addr: Sender address (default: wlrobbi@stsgym.com)
        attachments: List of file paths to attach
    
    Returns:
        True if queued successfully
    """
    msg = MIMEMultipart()
    msg["From"] = from_addr
    msg["To"] = to
    msg["Subject"] = subject
    
    # Add text body
    msg.attach(MIMEText(body, "plain"))
    
    # Add attachments
    if attachments:
        for filepath in attachments:
            path = Path(filepath)
            if not path.exists():
                print(f"Warning: Attachment not found: {filepath}")
                continue
            
            if path.suffix.lower() in (".png", ".jpg", ".jpeg", ".gif", ".webp"):
                # Image attachments
                with open(path, "rb") as f:
                    img = MIMEImage(f.read(), _subtype=path.suffix[1:])
                    img.add_header("Content-Disposition", "attachment", filename=path.name)
                    msg.attach(img)
            else:
                # Generic file attachments
                with open(path, "rb") as f:
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(f.read())
                    encoders.encode_base64(part)
                    part.add_header("Content-Disposition", "attachment", filename=path.name)
                    msg.attach(part)
    
    # Send via local Postfix (reliable, handles queuing and retries)
    try:
        proc = subprocess.Popen(
            ["/usr/sbin/sendmail", "-t", "-f", from_addr],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = proc.communicate(msg.as_string().encode())
        
        if proc.returncode == 0:
            print(f"Email queued: {subject} -> {to}")
            return True
        else:
            print(f"Sendmail error: {stderr.decode()}")
            return False
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def main():
    """CLI interface."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Send email via local Postfix")
    parser.add_argument("-t", "--to", required=True, help="Recipient email")
    parser.add_argument("-s", "--subject", required=True, help="Email subject")
    parser.add_argument("-b", "--body", required=True, help="Email body text")
    parser.add_argument("-f", "--from", dest="from_addr", default="wlrobbi@stsgym.com", help="Sender email")
    parser.add_argument("-a", "--attach", action="append", help="Attachment file path (can be used multiple times)")
    
    args = parser.parse_args()
    
    success = send_email(
        to=args.to,
        subject=args.subject,
        body=args.body,
        from_addr=args.from_addr,
        attachments=args.attach,
    )
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()