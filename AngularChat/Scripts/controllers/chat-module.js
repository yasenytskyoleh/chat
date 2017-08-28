(function () {
    'use strict';

    angular.module('simpleChat', ['ngAnimate']);
    angular.module('simpleChat').directive('simpleChat', ['$timeout', SimpleChat]);

    function SimpleChat($timeout) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'Scripts/controllers/chat-template.html',
            replace: true,
            scope: {
                messages: '=',
                user: '=',
                advisors: '=',
                myUserId: '=',
                submitButtonText: '@',
                head: '@',
                theme: '@',
                submitFunction: '&',
                visible: '=',
                infiniteScroll: '&',
                expandOnNew: '=',
                object: '='
            },
            link: link,
            controller: ChatCtrl,
            controllerAs: 'vm'
        };

        function link(scope, element) {

            if (!scope.submitButtonText || scope.submitButtonText === '') {
                scope.submitButtonText = 'Send';
            }

            if (!scope.title) {
                scope.title = 'Chat';
            }

            scope.$msgContainer = $('.msg-container-base'); // BS angular $el jQuery lite won't work for scrolling

            scope.$chatInput = $('.chat-input');

            $.mCustomScrollbar.defaults.theme = "3d-dark"; //set "light-2" as the default theme
            scope.$msgContainer.mCustomScrollbar();
        }
        return directive;
    }

    ChatCtrl.$inject = ['$scope', 'Chat', '$timeout', '$rootScope'];

    function ChatCtrl($scope, Chat,  $timeout, $rootScope) {

        var vm = this;
        vm.isHidden = true;
        vm.messages = $scope.messages;
        vm.advisors = $scope.advisors;
        vm.user = $scope.user;
        vm.myUserId = $scope.myUserId;
        vm.inputPlaceholderText = $scope.inputPlaceholderText;
        vm.submitButtonText = $scope.submitButtonText;
        vm.title = $scope.head;
        vm.theme = 'chat-th-' + $scope.theme;
        vm.message = '';
        vm.panelStyle = { 'display': 'none' };
        vm.closeChatStyle = { 'display': 'none' };
        vm.chatButtonClass = 'fa-expand icon_minim';
        vm.height = { 'height': '30px' };
        vm.objectPanelButtonClass = ' fa-angle-double-right icon_minim';
        vm.objectPanel = 'object-panel';
        vm.noObjectClass = 'no-object';
        vm.objContainerStyle = { 'display': 'none'}

        vm.object = $scope.object;

        vm.toggle = toggle;
        vm.toggleObjectPanel = toggleObjectPanel;
        vm.close = close;
        vm.submitFunction = submitFunction;
        vm.ctrlEnter = ctrlEnter;

        

        $rootScope.$on('addUserMessage', function (e, receiver, message) {
            $scope.$apply(function () {
                //add this message to the current message list.
                return vm.messages.push({
                    user: receiver,
                    content: message,
                    date: new Date(),
                    role: 'user'
                });
            });
        });

        $rootScope.$on('sendCode', function (e, receiver, message) {
            vm.noObjectClass = '';
            vm.objContainerStyle = { 'display': 'block' };
            vm.togglePanels = true;
            $timeout(function () {
                $('.format-code').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
            }, 0);
            $scope.$apply(function () {
                vm.object = message;
                return vm.object;
            });
        });

        $rootScope.$on('sendMessage', function (e, receiver, message) {
            vm.togglePanels = false;
            scrollToBottom();
            $timeout(function () {
                $scope.$apply(function () {
                    return vm.messages.push({
                        user: vm.advisors.name,
                        content: message,
                        date: new Date(),
                        role: 'advisor'
                    })
                });
            }, 3000);
            
        });

        function submitFunction() {
            //$scope.submitFunction()(vm.writingMessage, vm.username);
            if (vm.message !== '') {
                Chat.sendMessage(vm.user, vm.message);
                $(".chat-input").focus();
            }               
            vm.message = '';
            scrollToBottom();
        }

        function ctrlEnter($event) {
            var e = $event;
            if (((e.keyCode === 13) || (e.keyCode === 10)) && (e.ctrlKey === false)) {
                submitFunction();
                e.preventDefault();
            }
            if (((e.keyCode === 13) || (e.keyCode === 10)) && (e.ctrlKey === true)) {                
                vm.message += '\r\n';
                $timeout(function () {
                    $scope.$chatInput[0].scrollTop = $scope.$chatInput[0].scrollHeight;
                })
            }
        }


        $scope.$watch('visible', function () { // make sure scroll to bottom on visibility change w/ history items
            scrollToBottom();
            $timeout(function () {
                $scope.$chatInput.focus();
            }, 250);
        });
        $scope.$watch('messages.length', function () {
            if (!$scope.historyLoading) scrollToBottom(); // don't scrollToBottom if just loading history
            if ($scope.expandOnNew && vm.isHidden) {
                toggle();
            }
        });


        function scrollToBottom() {
            $timeout(function () {
                $scope.$msgContainer.mCustomScrollbar('scrollTo','last',{
                    scrollEasing: "linear",
                    timeout: 1000,
                });
            });
        }

        function close() {
            $scope.visible = false;
        }

        function toggle() {
            if (vm.isHidden) {
                vm.chatButtonClass = 'fa-angle-double-down icon_minim';
                vm.panelStyle = { 'display': 'flex' };
                vm.closeChatStyle = { 'display': 'inline-block' };
                vm.title = '';
                vm.isHidden = false;
                vm.height = { 'height': 'auto' };
                scrollToBottom();
            } else {
                vm.chatButtonClass = 'fa-expand icon_minim';
                vm.panelStyle = { 'display': 'none' };
                vm.closeChatStyle = { 'display': 'none' };
                vm.isHidden = true;
                vm.height = { 'height': '50px' };
            }
        }

        function toggleObjectPanel() {
            if (vm.togglePanels) {
                vm.togglePanels = false;
                scrollToBottom();
            }
            else {
                vm.togglePanels = true;
                $timeout(function () {
                    $('.format-code').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                }, 0);
            }

        }

    }
})();
