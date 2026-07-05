# Sittie Melhayah Amerol
# MSIT 132 - API Demo

import requests

url = "https://jsonplaceholder.typicode.com/posts/1"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("Post Title:", data["title"])
else:
    print("Error:", response.status_code)