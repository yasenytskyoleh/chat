//Angular chat service
angular.module('AngularChat')
    .service('Chat', ['$rootScope', function ChatService($rootScope) {
        var proxy = null;

        var initialize = function () {
            //Getting the connection object
            connection = $.hubConnection();

            //Creating proxy
            this.proxy = connection.createHubProxy('chatHub');

            //Starting connection
            connection.start().done(
                console.log('connection start')
            );

            //Publishing an event when server pushes a new message
            this.proxy.on('addUserMessageToPage', function (receiver, message) {
                $rootScope.$emit("addUserMessage", receiver, message);
            })

            this.proxy.on('sendCode', function(receiver, message){
                $rootScope.$emit("sendCode", receiver, message);
            })

            this.proxy.on('sendMessage', function (receiver, message) {
                $rootScope.$emit("sendMessage", receiver, message);
            })
        };

        var sendMessage = function (receiver, message) {
            //Invoking the send method defined in hub ( note in ChatHub.cs it's Send javacript signalr changes it to send.)
            this.proxy.invoke('send', receiver, message);
        };

         
        //return service object.
        return {
            initialize: initialize,
            sendMessage: sendMessage,
        };
    }]);