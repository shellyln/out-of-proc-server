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
using System.IO;
using System.Threading.Tasks;
using Grpc.Core;
using Shellyl_N.OutOfProcServer;
using Newtonsoft.Json;
using ClosedXML.Excel;
using Helloworld;

namespace GreeterServer
{
    class GreeterImpl : Greeter.GreeterBase
    {
        // Server side handler of the SayHello RPC
        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Sample Sheet");
                worksheet.Cell("A1").Value = "Hello " + request.Name;

                workbook.SaveAs("HelloWorld.xlsx");

                var jsonStr = JsonConvert.SerializeObject(new {
                    foo = "abcd",
                    bar = 1234
                });
                var jsonObj = JsonConvert.DeserializeObject(jsonStr);

                using (var fs = new MemoryStream())
                {
                    workbook.SaveAs(fs);
                    fs.Position = 0;
                    
                    var bytes = new byte[1024 * 1];
                    var nRead = 0;
                    while ((nRead = fs.Read(bytes)) > 0)
                    {
                        Console.WriteLine(".");
                    }

                    return Task.FromResult(new HelloReply { Message = "Hello " + request.Name });
                }
            }
        }
    }

    class Program
    {
        const int Port = 50051;

        public static void Main(string[] args)
        {
            Console.WriteLine("gRPC Server: Process Started.");

            Server server = new Server
            {
                Services = { Greeter.BindService(new GreeterImpl()) },
                Ports = { new ServerPort("localhost", Port, ServerCredentials.Insecure) }
            };
            server.Start();

            Console.WriteLine("gRPC Server: Greeter server listening on port " + Port);

            try
            {
                Notifier.NotifyReadyToClient("testpipe").Wait().Shutdown();
                Console.WriteLine("gRPC Server: Pipe closed.");
            }
            catch (IOException e)
            {
                Console.WriteLine("gRPC Server: Pipe broken: " + e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("gRPC Server: Error: " + e.Message);
            }

            Console.WriteLine("gRPC Server: Shutting down gRPC server...");
            server.ShutdownAsync().Wait();
            Console.WriteLine("gRPC Server: Exit process.");
        }
    }
}
