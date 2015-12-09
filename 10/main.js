var app = angular.module('app', []);

// app.controller('usersCtrl', ['$scope', '$rootScope', 'mainService', function($scope, $rootScope, mainService) {
//     $scope.usersList = mainService.getUsersList();
// }]);


app.directive('usersList', ['mainService', function(mainService){
    return {
        restrict: 'E',
        scope: {},
        template: '<div class="checkbox" ng-repeat="user in usersList.data"><label><input type="checkbox" ng-model="user.isChecked" ng-click="userClicked()">{{ user.username }}</label></div>',
        link: function(){

        },
        controller: function($scope){
            $scope.usersList = mainService.getUsersList();
            $scope.userClicked = function(){
                mainService.updateTodos();
                // mainService.getuserTodoList(id);
            };
            // this.onDataLoadedChange = function(){

            // };
        }
    };
}]);


app.directive('todoList', ['mainService', function(mainService){
    return {
        restrict: 'E',
        scope: {},
        template: '<table class="table" ><thead><tr><th>userId</th><th>id</th><th>title</th><th>completed</th></tr></thead><tbody><tr ng-repeat="todo in userTodoList.data | orderBy : \'userId\' "><td>{{todo.userId}}</td><td>{{todo.id}}</td><td>{{todo.title}}</td><td>{{todo.completed}}</td></tr></tbody></table>',
        link: function(){

        },
        controller: function($scope){
            $scope.userTodoList = mainService.getTodoList();
        }
    };
}]);

app.service('mainService', ['$http', '$rootScope', function($http, $rootScope) {
    var usersList = {
        data: []
    };
    var userTodoList = {
        data: []
    };

    this.getUsersList = function() {
        return usersList;
    };

    this.getTodoList = function() {
        return userTodoList;
    };
    $http.get('http://jsonplaceholder.typicode.com/users').then(function(response) {
        usersList.data = response.data;
        // console.log("Start Version:", userRating.data.version);
        // $rootScope.$applyAsync();
        // $rootScope.$emit('dataLoaded');
    });


    this.updateTodos = function(){
        userTodoList.data = [];
        usersList.data.forEach(function(user){
            if (user.isChecked) {
                getuserTodoList(user.id);
            }
        });
        $rootScope.$applyAsync();
        console.log('userTodoList:', userTodoList);
    };

    function getuserTodoList(userId) {
        $http.get('http://jsonplaceholder.typicode.com/users/' + userId + '/todos').then(function(response) {
            userTodoList.data = userTodoList.data.concat(response.data);
        });
    }

}]);

