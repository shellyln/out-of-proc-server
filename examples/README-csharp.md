gRPC Out-of-proc Server in 3 minutes (C#)
========================

BACKGROUND
-------------
This is a version of the helloworld example using the dotnet SDK
tools to compile [helloworld.proto](protos/helloworld.proto) in a common library, build the server
and the client, and run them.

PREREQUISITES
-------------

- The [.NET Core SDK 2.1+](https://www.microsoft.com/net/core)

You can also build the solution `Greeter.sln` using Visual Studio 2017,
but it's not a requirement.

BUILD AND RUN
-------------

- ~~Build and run the server~~
    * The server will start automatically when the client is starting.

  ```
  > dotnet run -p GreeterServer
  ```

- Build and run the client

  ```
  > dotnet run -p GreeterClient
  ```

Tutorial
--------

You can find a more detailed tutorial about Grpc in [gRPC Basics: C#](https://grpc.io/docs/tutorials/basic/csharp.html)
