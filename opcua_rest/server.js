const app = require("express")();
const http = require("http").createServer(app);

const {OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  ClientSubscription,
  TimestampsToReturn,
  ClientMonitoredItem} = require("node-opcua");

const connectionStrategy = {
  initialDelay: 1000,
  maxRetry: 1,
};

const client = OPCUAClient.create({
  applicationName: "MyClient",
  connectionStrategy: connectionStrategy,
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  endpointMustExist: false,
});

const objectRead = {
  speed: [],
  temperature: []
};

const endpointUrl = "opc.tcp://0.0.0.0:4840//freeopcua/server/";

app.get("/readData", (req, res) => {
  res.send(objectRead)
});

app.get("/speed", (req, res) => {
  res.send(objectRead.speed)
});

app.get("/temperature", (req, res) => {
  res.send(objectRead.temperature)
});

async function main() {
  try {
    // connect 
    await client.connect(endpointUrl);
    console.log("connected !");

    const session = await client.createSession();
    console.log("session created !");

    // subscription
    const subscription = ClientSubscription.create(session, {
      requestedPublishingInterval: 1000,
      requestedLifetimeCount: 100,
      requestedMaxKeepAliveCount: 10,
      maxNotificationsPerPublish: 100,
      publishingEnabled: true,
      priority: 10,
    });

    subscription
      .on("started", function () {
        console.log(
          "subscription started for 2 seconds - subscriptionId=",
          subscription.subscriptionId
        );
      })
      .on("keepalive", function () {
        console.log("keepalive");
      })
      .on("terminated", function () {
        console.log("terminated");
      });

    // monitored item
    const itemToMonitor = {
      nodeId: "ns=1;s=Speed",
      attributeId: AttributeIds.Value,
    };

    const itemToMonitorTwo = {
      nodeId: "ns=2;s=Temperature",
      attributeId: AttributeIds.Value,
    }

    const parameters = {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 10,
    };

    const monitoredItem = ClientMonitoredItem.create(
      subscription,
      itemToMonitor,
      parameters,
      TimestampsToReturn.Both
    );

    const monitoredTwo = ClientMonitoredItem.create(
      subscription,
      itemToMonitorTwo,
      parameters,
      TimestampsToReturn.Both
    );

    monitoredItem.on("changed", (dataValue) => {
      objectRead.speed.push(dataValue.value.value[1])
    });

    monitoredTwo.on("changed", (dataValue) => {
      objectRead.temperature.push(dataValue.value.value[1])
    });

    await timeout(10000);

    console.log("now terminating subscription");
    await subscription.terminate();

    await session.close();

    // disconnect
    await client.disconnect();
    console.log("done !");
  } catch (err) {
    console.log("An error has occured : ", err);
  }
}

main();


http.listen(3000, () => {
  console.log(`Server running http://localhost:3000/readData`);
});
