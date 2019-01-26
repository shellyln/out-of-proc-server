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

namespace Shellyl_N.OutOfProcServer
{
    public class ServerContext : IDisposable
    {
        private System.IO.Pipes.NamedPipeServerStream _serverPipe;
        public System.IO.Pipes.NamedPipeServerStream serverPipe
        {
            get {
                return this._serverPipe;
            }
        }

        private System.Diagnostics.Process _childProc;
        public System.Diagnostics.Process childProc
        {
            get {
                return this._childProc;
            }
        }

        internal ServerContext(System.IO.Pipes.NamedPipeServerStream serverPipe, System.Diagnostics.Process childProc)
        {
            this._serverPipe = serverPipe;
            this._childProc = childProc;
        }

        public ServerContext Shutdown()
        {
            if (this._serverPipe != null)
            {
                this._serverPipe.Close();
                this._serverPipe = null;
            }
            return this;
        }

        public void Dispose()
        {
            try
            {
                this.Shutdown();
            }
            catch
            {
                // ignore error
            }
        }
    }

    public class Launcher
    {
        public static ServerContext LaunchServer(string pipeName, string command, string[] args)
        {
            var serverPipe =
                new System.IO.Pipes.NamedPipeServerStream(
                    pipeName, System.IO.Pipes.PipeDirection.InOut);

            var startInfo = new System.Diagnostics.ProcessStartInfo(command);
            startInfo.Arguments = String.Join(" ", args);
            var childProc = System.Diagnostics.Process.Start(startInfo);

            serverPipe.WaitForConnection();

            return new ServerContext(serverPipe, childProc);
        }
    }

    public class Notifier : IDisposable
    {
        private System.IO.Pipes.NamedPipeClientStream _clientPipe;
        public System.IO.Pipes.NamedPipeClientStream clientPipe
        {
            get {
                return this._clientPipe;
            }
        }

        private Notifier(System.IO.Pipes.NamedPipeClientStream clientPipe)
        {
            this._clientPipe = clientPipe;
        }

        public Notifier Wait()
        {
            var buf = new byte[1024];
            var n = this._clientPipe.Read(buf, 0, buf.Length);
            return this;
        }

        public Notifier Shutdown()
        {
            if (this._clientPipe != null)
            {
                this._clientPipe.Close();
                this._clientPipe = null;
            }
            return this;
        }

        public void Dispose()
        {
            try
            {
                this.Shutdown();
            }
            catch
            {
                // ignore error
            }
        }

        public static Notifier NotifyReadyToClient(string pipeName)
        {
            var clientPipe =
                new System.IO.Pipes.NamedPipeClientStream(
                    ".", pipeName, System.IO.Pipes.PipeDirection.InOut);
            clientPipe.Connect();
            return new Notifier(clientPipe);
        }
    }
}
