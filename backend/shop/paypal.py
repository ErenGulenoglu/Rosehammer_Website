import requests
from django.conf import settings


def get_access_token():
    url = f"{settings.PAYPAL_API_BASE}/v1/oauth2/token"
    auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET)

    headers = {"Accept": "application/json"}
    data = {"grant_type": "client_credentials"}

    response = requests.post(url, headers=headers, data=data, auth=auth)
    response.raise_for_status()

    return response.json()["access_token"]


def create_paypal_order(amount):
    token = get_access_token()
    url = f"{settings.PAYPAL_API_BASE}/v2/checkout/orders"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    json_data = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": f"{amount:.2f}",
                }
            }
        ],
    }

    response = requests.post(url, json=json_data, headers=headers)
    response.raise_for_status()

    return response.json()


def capture_paypal_order(order_id):
    token = get_access_token()
    url = f"{settings.PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    response = requests.post(url, headers=headers)
    response.raise_for_status()

    return response.json()
