from web3 import Web3
import threading

private_key = "" # input your private key
address = "" # input your public key
rpc_url = "" # public rpc node
web3 = Web3(Web3.HTTPProvider(rpc_url))
print(web3.is_connected())
print(Web3.from_wei(web3.eth.get_balance(address), 'ether'))

def handle_transaction(tx, private_key):
    try:
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        if receipt.status == 1:
            print("Mint Success!",web3.to_hex(tx_hash))
        else:
            print("Mint Failed!")
    except Exception as e:
        print(e)

def mint(count):
    nonce = web3.eth.get_transaction_count(address)
    print(Web3.from_wei(web3.eth.get_balance(address), 'ether'))
    threads = []
    for i in range(count):
        tx = {
            'nonce': nonce,
            'chainId': 1088,
            'to': address, # self-transfer?
            'from': address,
            'data': '',  # mint data in hex
            'gasPrice': web3.eth.gas_price,
            'value': Web3.to_wei(0, 'ether')
        }
        gas = web3.eth.estimate_gas(tx)
        tx['gas'] = gas
        nonce += 1
        thread = threading.Thread(target=handle_transaction, args=(tx, private_key))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()
while True:
    mint(3)
