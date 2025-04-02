import requests
import json

BASE_URL = "https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/auth/login"

def test_api():
    payload = {
  "body": "{ \"email\": \"byrrajuvishnuvardhan@gmail.com\", \"password\": \"Vishnu@9652\" }"
}
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(BASE_URL, json=payload, headers=headers)
        print("Status Code:", response.status_code)
        print("Response:", response.json())
    except requests.exceptions.RequestException as e:
        print("Error:", e)

if __name__ == "__main__":
    test_api()
