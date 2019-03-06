#!/usr/bin/env node
"use strict";

//module dependencies
const server = require("./dist/server");

server.Server.bootstrap().then().catch(e => console.error(e));
