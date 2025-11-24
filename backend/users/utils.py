from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.core.mail import send_mail
import smtplib
from django.conf import settings
import threading
import os
import json
import base64

signer = TimestampSigner(salt="sign-up")

def generate_registration_token(data):
    payload = json.dumps(data)
    signed = signer.sign(payload)  # this creates payload:signature
    # Encode in URL-safe base64
    token_bytes = signed.encode("utf-8")
    token_b64 = base64.urlsafe_b64encode(token_bytes).decode("utf-8")
    return token_b64

def verify_registration_token(token_b64, max_age=60*60*24):
    try:
        # Decode from base64
        signed = base64.urlsafe_b64decode(token_b64.encode("utf-8")).decode("utf-8")
        unsigned = signer.unsign(signed, max_age=max_age)
        return json.loads(unsigned)
    except Exception:
        return None

def send_email_async(subject, message, recipient_list):
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            fail_silently=False,
        )
    except Exception as e:
        print("Email error:", e)

def send_verification_email(token, email):
    frontend_url = "http://localhost:5173" if os.getenv("DEBUG", "True") == "True" else "https://rosehammer-studios.onrender.com"
    verify_url = f"{frontend_url}/verify-email/?token={token}"

    subject = "Verify your email address"
    message = f"""Hello,
Click the link below to verify your account:
{verify_url}
If you did not register, ignore this message.
Regards,
Rosehammer Studios
"""

    threading.Thread(target=send_email_async, args=(subject, message, [email])).start()