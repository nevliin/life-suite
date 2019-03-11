#!/usr/bin/env node
"use strict";

require('ts-node').register({ /* options */ });

const server = require("./src/server");

server.Server.bootstrap().then().catch(e => console.error(e));
