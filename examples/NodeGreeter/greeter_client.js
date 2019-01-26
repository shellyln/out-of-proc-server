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
const fs = require('fs');
const util = require('util');
const launchServer = require('../../index').launchServer;
const messages = require('../NodeGreeter/helloworld_pb');
const services = require('../NodeGreeter/helloworld_grpc_pb');
const getStdin = require('./get_stdin');



function main() {
    (async () => {
        try {
            console.log('gRPC Node Client: Waiting for launch server...');

            const server = await launchServer('testpipe', 'dotnet', [
                '../GreeterServer/bin/Debug/netcoreapp2.2/GreeterServer.dll'
            ], { stdio: ['ignore', 'inherit', 'inherit'] });
            // const server = await launchServer('testpipe', 'node', [
            //     './greeter_server.js'
            // ], { stdio: ['ignore', 'inherit', 'inherit'] });

            {
                console.log('gRPC Node Client: ' + 'Child process (gRPC server process) ready.');

                const client = new services.GreeterClient('localhost:50051',
                    grpc.credentials.createInsecure());

                {
                    const request = new messages.HelloRequest();
                    request.setName('node client');

                    console.log('gRPC Node Client: Waiting for greeting...');
                    const response = await util.promisify((...a) => client.sayHello(...a))(request);
                    console.log('gRPC Node Client: Greeting:', response.getMessage());
                }

                console.log('gRPC Node Client: Press any key to exit...');
                fs.readSync(getStdin() || 0, Buffer.alloc(1024), 0, 1024); // <- Don't set position on *nix environment.

                client.close();
            }

            console.log('gRPC Node Client: Shutting down...');
            await server.shutdown();
            console.log('gRPC Node Client: Exit');
        } catch (e) {
            console.log('gRPC Node Client: Error:' + e.messages);
            process.exit(-1);
        }
    })();
}


main();
