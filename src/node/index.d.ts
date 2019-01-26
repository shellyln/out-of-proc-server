
import { Socket, Server } from 'net';
import { ChildProcess, SpawnOptions } from 'child_process';


interface ServerContext {
    serverPipe: Server;
    conn: Socket;
    childProc: ChildProcess;
    shutdown: () => Promise<void>;
}

export declare function launchServer(pipeName: string, command: string, args: string[], spawnOpts?: SpawnOptions): Promise<ServerContext>;
export declare function notifyReadyToClient(pipeName: string, handler: (event: string, eventArg?: any) => void): Socket;
