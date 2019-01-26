/*
 *
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


const fs = require('fs');
const net = require('net');
const path = require('path');
const child_process = require('child_process');



function makePipeName(name) {
    if (process.platform === 'win32') {
        return path.join('\\\\?\\pipe', name);
    } else {
        // UNIX domain socket
        const sockName = '/tmp/CoreFxPipe_' + name;
        try {
            fs.unlinkSync(sockName);
        } catch (e) {
            // ignore error
        }
        return sockName;
    }
}



function notifyReadyToClient(pipeName, handler) {
    return net.createConnection(makePipeName(pipeName))
    .on('close', (had_error) => {
        handler('close', had_error);
    })
    .on('error', (e) => {
        handler('error', e);
    })
    ;
}
exports.notifyReadyToClient = notifyReadyToClient;



function launchServer(pipeName, command, args, spawnOpts) {
    const promise = new Promise((resolve, reject) => {
        let isFirst = true;
        let isResolved = false;
        let childProc;

        function shutdown() {
            const promise = new Promise((resolve, reject) => {
                this.serverPipe.close(() => {
                    resolve();
                });
                try {
                    this.conn.destroy();
                    this.serverPipe.unref();
                } catch (e) {
                    reject(e);
                }
            });
            return promise;
        }

        const serverPipe = net.createServer((conn) => {
            try {
                if (isFirst) {
                    isFirst = false;
                    isResolved = true;
                    resolve({
                        serverPipe,
                        conn,
                        childProc,
                        shutdown,
                    });
                } else {
                    conn.destroy();
                }
            } catch (e) {
                reject(e);
            }
        }).listen(makePipeName(pipeName), () => {
            try {
                childProc = child_process.spawn(command, args, spawnOpts);
                childProc
                .on('error', (e) => {
                    if (! isResolved) {
                        reject(e);
                    }
                })
                // eslint-disable-next-line no-unused-vars
                .on('close', (code, signal) => {
                    if (code) {
                        if (! isResolved) {
                            reject(new Error('launchServer: Process failed.'));
                        }
                    }
                })
                ;
            } catch (e) {
                reject(e);
            }
        });
    });
    return promise;
}
exports.launchServer = launchServer;
