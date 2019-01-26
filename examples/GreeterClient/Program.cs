// Copyright 2015 gRPC authors.
// Copyright 2019 Shellyl_N.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;
using Grpc.Core;
using Shellyl_N.OutOfProcServer;
using Helloworld;

namespace GreeterClient
{
    class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                Console.WriteLine("gRPC Client: " + System.IO.Directory.GetCurrentDirectory());
                Console.WriteLine("gRPC Client: Waiting for launch server...");

                var server = Launcher.LaunchServer("testpipe", "dotnet", new [] {
                    @"../GreeterServer/bin/Debug/netcoreapp2.2/GreeterServer.dll"
                });

                {
                    Console.WriteLine("gRPC Client: " + "Child process (gRPC server process) ready.");

                    Channel channel = new Channel("127.0.0.1:50051", ChannelCredentials.Insecure);
                    var client = new Greeter.GreeterClient(channel);

                    {
                        Console.WriteLine("gRPC Client: Waiting for greeting...");
                        var reply = client.SayHello(new HelloRequest { Name = "you" });
                        Console.WriteLine("gRPC Client: Greeting: " + reply.Message);
                    }

                    Console.WriteLine("gRPC Client: Press any key to exit...");
                    Console.ReadKey();

                    channel.ShutdownAsync().Wait();
                }

                Console.WriteLine("gRPC Client: Shutting down...");
                server.Shutdown();
                Console.WriteLine("gRPC Client: Exit");
            }
            catch (Exception e)
            {
                Console.WriteLine("gRPC Client: Error: " + e.Message);
                Environment.Exit(-1);
            }
        }
    }
}
