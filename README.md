# Out-of-proc Server

Launch the gRPC server (or other type of server) on demand from the application.

Out-of-proc-server (+ gRPC) provides interoperability between Node.js JavaScript and .NET framework (and other languages you additionally implement the "out-of-proc-server" sequence).

It helps you to create the desktop applications based on distributed architecture.


---


## Install

### Node.js

#### Prerequirements

* Node >= 10

```bash
$ npm install out-of-proc-server --save
```

### .NET framework

> Note: We have not published this to NuGet yet.

#### Prerequirements

* .NET Core SDK >= 2.1

#### Install
1. Download the source archive from [https://github.com/shellyln/out-of-proc-server/archive/master.zip](https://github.com/shellyln/out-of-proc-server/archive/master.zip) and extract it.
1. Add `src/dotnet/OutOfProcServer/OutOfProcServer.csproj` to your solution.


---


## Usage

See [examples](https://github.com/shellyln/out-of-proc-server/tree/master/examples).


---


## APIs

### Node.js

#### launchServer

[Call from gRPC Client (Pipe Server)]  
Launch the out-of-proc server process.

```ts
interface ServerContext {
    serverPipe: Server;
    conn: Socket;
    childProc: ChildProcess;
    shutdown: () => Promise<void>;
}

function launchServer(pipeName: string, command: string, args: string[], spawnOpts?: SpawnOptions): Promise<ServerContext>
```

* returns : launched server process info.
    * promise will resolved when the server process connect to the pipe.
* `pipeName` : name of the named pipe.
* `command` : executable path.
* `args` : command line arguments.
* `spawnOpts` : options of `child_process.spawn()`.

#### ServerContext#shutdown

[Call from gRPC Client (Pipe Server)]  
Close the server pipe and end listening.

```ts
function shutdown(): Promise<void>
```

* returns : none.
    * promise will resolved when the pipe is closed.

#### notifyReadyToClient

[Call from gRPC Server (Pipe Client)]  
Notify to the client process that the out-of-proc server is ready to accept the requests.

```ts
function notifyReadyToClient(pipeName: string, handler: (event: string, eventArg?: any) => void): Socket;
```

* returns : Socket of client pipe.
* `pipeName` : name of the named pipe.
* `handler` : event handler that called if 'close' or 'error' event is occured to the client pipe.

### .NET framework

#### Launcher.LaunchServer

[Call from gRPC Client (Pipe Server)]  
Launch the out-of-proc server process.

```c#
public static ServerContext LaunchServer(string pipeName, string command, string[] args);
```

* returns : launched server process info.
* `pipeName` : name of the named pipe.
* `command` : executable path.
* `args` : command line arguments.

#### ServerContext#Shutdown

[Call from gRPC Client (Pipe Server)]  
Close the server pipe and end listening.

```c#
public ServerContext Shutdown();
```

* returns : `this` object.

#### Notifier.NotifyReadyToClient

[Call from gRPC Server (Pipe Client)]  
Notify to the client process that the out-of-proc server is ready to accept the requests.

```c#
public static Notifier NotifyReadyToClient(string pipeName);
```

* returns : client pipe info.
* `pipeName` : name of the named pipe.

#### Notifier#Wait

[Call from gRPC Server (Pipe Client)]  
Wait forever until the client pipe is closed or broken.

```c#
public Notifier Wait();
```

* returns : `this` object.

#### Notifier#Shutdown

[Call from gRPC Server (Pipe Client)]  
Close the client pipe.

```c#
public Notifier Shutdown();
```

* returns : `this` object.


---


## Sequence diagram

> Note: *nix environments use UNIX domain sockets instead of named pipes.


### Graceful shutdown

![Graceful](https://raw.githubusercontent.com/shellyln/out-of-proc-server/master/docs/graceful.svg?sanitize=true)




### Unexpected shutdown

![Unexpected](https://raw.githubusercontent.com/shellyln/out-of-proc-server/master/docs/unexpected.svg?sanitize=true)


---


## License
Apache-2.0

Copyright (c) 2019, Shellyl_N and Authors.

## License of examples (./examples)
Apache-2.0

Copyright 2015 gRPC authors.  
Copyright (c) 2019, Shellyl_N and Authors.
