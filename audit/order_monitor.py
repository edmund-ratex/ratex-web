import requests
import json
import datetime
import time

last_timestamp = 0  

def make_request():
    try:
        url = 'https://www.okx.com/priapi/v1/nft/brc/detail/activity?t=1701866996986&tick=Dovi&type=21&pageSize=20&ticker=Dovi'
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()["data"]["activityList"]
        else:
            return None
    except Exception as e:
        print('Error occurred while making the request:', str(e))
        return None

def main():
    global last_timestamp  
    while True:
        response = make_request()
        if response is not None:
            for order in response:
                timestamp = order["createOn"] / 1000
                if timestamp > last_timestamp:
                    dt = datetime.datetime.fromtimestamp(timestamp)
                    formatted_date = dt.strftime("%Y-%m-%d %H:%M:%S")
                    ticker = order["ticker"]
                    type_name = order["typeName"]
                    amount = order["amount"]
                    usd_price = order["unitPrice"]["usdPrice"]
                    all_price = order["totalPrice"]["usdPrice"]
                    print(formatted_date, ticker, type_name, amount, usd_price,all_price)
                    last_timestamp = timestamp  
        else:
            print('Error occurred while making the request.')

        time.sleep(60)

if __name__ == '__main__':
    main()
