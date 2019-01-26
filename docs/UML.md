render it using https://shellyln.github.io/menneu/playground.html


## Graceful shutdown

@startuml

participant "gRPC Client\\n(Pipe Server)" as gRPCClient
participant "gRPC Server\\n(Pipe Client)" as gRPCServer


[-> gRPCClient : spawn
activate gRPCClient

gRPCClient -> gRPCClient : create the named pipe\\nand start listening

gRPCClient -\\ gRPCServer : spawn
activate gRPCServer

gRPCClient -> gRPCClient : wait for connection\\nto the named pipe

gRPCServer -> gRPCServer : start gRPC server service

gRPCServer -\\ gRPCClient : notify ready\\nby connecting\\nto the named pipe

gRPCServer -> gRPCServer : wait forever

gRPCClient -> gRPCClient : start gRPC client

gRPCClient -\\ gRPCServer : call gRPC function
gRPCClient \\-- gRPCServer : return message

gRPCClient -> gRPCClient : close gRPC client

gRPCClient -\\ gRPCServer : notify quit by closing\\nthe named pipe

gRPCServer -> gRPCServer : exit
deactivate gRPCServer
destroy gRPCServer

gRPCClient -> gRPCClient : exit
deactivate gRPCClient
destroy gRPCClient

@enduml


## Unexpected shutdown

@startuml

participant "gRPC Client\\n(Pipe Server)" as gRPCClient
participant "gRPC Server\\n(Pipe Client)" as gRPCServer


[-> gRPCClient : spawn
activate gRPCClient

gRPCClient -> gRPCClient : create the named pipe\\nand start listening

gRPCClient -\\ gRPCServer : spawn
activate gRPCServer

gRPCClient -> gRPCClient : wait for connection\\nto the named pipe

gRPCServer -> gRPCServer : start gRPC server service

gRPCServer -\\ gRPCClient : notify ready\\nby connecting\\nto the named pipe

gRPCServer -> gRPCServer : wait forever

gRPCClient -> gRPCClient : start gRPC client

gRPCClient -\\ gRPCServer : call gRPC function
gRPCClient \\-- gRPCServer : return message

gRPCClient -> gRPCClient : exit by unexpected error
deactivate gRPCClient
destroy gRPCClient

gRPCClient -\\ gRPCServer : notify quit by closing\\nthe named pipe

gRPCServer -> gRPCServer : exit
deactivate gRPCServer
destroy gRPCServer

@enduml

