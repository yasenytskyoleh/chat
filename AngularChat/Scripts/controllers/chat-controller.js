(function () {
    'use strict';

    angular.module('AngularChat', ['simpleChat', 'ngAnimate']);

    angular.module('AngularChat').controller('Shell', Shell);

    Shell.$inject = ['$scope', 'Chat'];

    function Shell($scope, Chat) {

        var vm = this;

        vm.advisors = {
            'name': 'Мой робот',
            'imageUrl': 'Content/Images/RobotImage.jpg'
        };
        vm.messages = [
          {
              'content': 'Hi! ASk me!',
              'date': '310720172149',
              'role': 'advisor'
          }
        ];

        vm.user = 'Matt';

        Chat.initialize();

    }

})();
