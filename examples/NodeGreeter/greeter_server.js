/*
 *
 * Copyright 2015 gRPC authors.
 * Copyright 2019 Shellyl_N.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


const grpc = require('grpc');
const messages = require('./helloworld_pb');
const services = require('./helloworld_grpc_pb');
const notifyReadyToClient = require('../../index').notifyReadyToClient;



/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
    const reply = new messages.HelloReply();
    reply.setMessage('Hello ' + call.request.getName());
    callback(null, reply);
}


/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
    const server = new grpc.Server();
    server.addService(services.GreeterService, { sayHello: sayHello });
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('gRPC Node Server: Greeter server listening on port ');

    notifyReadyToClient('testpipe', (event, m) => {
        switch (event) {
        case 'close':
            console.log('gRPC Node Server: pipe closed: error=' + m);
            break;
        case 'error':
            console.log('gRPC Node Server: Pipe broken: ' + m.messages);
            break;
        default:
            console.log('gRPC Node Server: pipe: ' + event);
            break;
        }

        console.log('gRPC Node Server: Shutting down gRPC server...');
        server.forceShutdown();
        console.log('gRPC Node Server: Exit process.');
    });
}


main();
