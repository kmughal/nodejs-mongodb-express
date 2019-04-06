const os = require("os");
const cluster = require("cluster");
const express = require("express");

const app = express();

const setExpressRoutes = () => {
	app.get("/", (req, res, next) => {
    process.send({
			cmd: "notifyRequest"
		});
		res.status(200).send(new Date());
	});
};

const startExpress = () => {
	setExpressRoutes();
	app.listen(3000, () => {
		console.log("Connected");
	});
};

//const messageHandler = m => console.log(m);
let numReqs = 0;
// setInterval(() => {
//   console.log(`numReqs = ${numReqs}`);
// }, 1000);

function messageHandler(msg) {
  console.log("message" , msg)
	if (msg.cmd && msg.cmd === "notifyRequest") {
		numReqs += 1;
	}
}

const createChildSpawn = numberOfCpus => {
	for (let i = 0; i < numberOfCpus; i++) {
		cluster.fork();
	}

	// Handle message
	for (const id in cluster.workers) {
		cluster.workers[id].on("message", messageHandler);
	}
};

// Bootstrap
if (cluster.isMaster) {
	createChildSpawn(os.cpus().length);
} else {
  startExpress();
  process.send({
    cmd: "notifyRequest"
  });
}

