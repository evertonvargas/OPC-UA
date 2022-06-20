from turtle import speed
from opcua import Client

class ButtonHandler(object):
    def datachange_notification(self,node, val, data):
      print(f"{node}: "+str(val))

def connect_client():
    client=Client("opc.tcp://localhost:4840")
    client.connect()

    return client

def main():
  client = connect_client()
  speed = client.get_node("ns=1;s=Speed")
  temperature = client.get_node("ns=2;s=Temperature")
  handler = ButtonHandler()
  sub = client.create_subscription(500, handler)
  sub.subscribe_data_change(speed)
  sub.subscribe_data_change(temperature)

if __name__ == "__main__":
    main()