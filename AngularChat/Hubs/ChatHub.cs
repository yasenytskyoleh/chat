using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace SignalRChat
{
    public class ChatHub : Hub
    {
        public void Send(string receiver, string message)
        {
            
            Clients.Caller.addUserMessageToPage(receiver, message);

            if (message == "code") {
                message = "using Microsoft.AspNet.SignalR;" + Environment.NewLine + "namespace SignalRChat" + Environment.NewLine + "public class ChatHub : Hub" + Environment.NewLine + "//public void SendCode(string receive, string message) //{ //    // Call the addNewMessageToPage method to update clients. //    Clients.Caller.showCode(receive, message)        //}                " +
                    "using Microsoft.AspNet.SignalR;" + Environment.NewLine + Environment.NewLine + Environment.NewLine + "public void SendCode(string receive, string message)" + "//public void SendCode(string receive, string message) //{ //    // Call the addNewMessageToPage method to update clients. //    Clients.Caller.showCode(receive, message)        //}                ";
                Clients.Caller.sendCode(receiver, message);
            }
            else if(message == "code2")
            {
                message = "(function () { 'use strict'; angular.module('AngularChat', ['simpleChat', 'ngAnimate']); angular.module('AngularChat').controller('Shell', Shell); Shell.$inject = ['$scope', 'Chat']; ";
                Clients.Caller.sendCode(receiver, message);
            }
            else
            {
                message = "Я всегда даю правильные ответы";
                Clients.Caller.sendMessage(receiver, message);
            }
            
        }

        //public void SendCode(string receive, string message)
        //{
        //    // Call the addNewMessageToPage method to update clients.
        //    Clients.Caller.showCode(receive, message);
        //}

    }
}