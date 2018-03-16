app.controller("profileController", ["$scope", "UserService", "alert", "$timeout", "$location",
function($scope, UserService, alert, $timeout, $location) {
  var loggedInUser = UserService.getUser();
  if (!loggedInUser) {
    $location.path('/signin');
    return;
  }
  $scope.isLoadingUser = true;
  UserService.getUserById(loggedInUser.id)
  .then(function(user) {
    $scope.user = user;
    $scope.newuser = copyUser(user);
    $scope.isLoadingUser = false;
    $scope.$apply();
  })
  .catch(function(err) {
    console.error(err);
    $scope.isLoadingUser = false;
    $scope.$apply();
  });

  $scope.onImageChosen = function(event) {
    if (event.target.files && event.target.files.length) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function(event) {
        if ($scope.newuser) {
          $scope.newuser.img_file = event.target.result;
          $scope.isEditingImage = true;
          $scope.$apply();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  $scope.editImage = function() {
    document.getElementById('avatar').click();
  }

  $scope.cancelImage = function() {
    $scope.isEditingImage = false;
    $scope.newuser.img_file = undefined;
  }

  $scope.saveImage = function() {
    $scope.isSavingImage = true;
    saveUser({ img_file: $scope.newuser.img_file })
    .then(function() {
      alert("Your image has been updated");
      $scope.isEditingImage = false;
      $scope.isSavingImage = false;
      $scope.$apply();
    })
    .catch(function(err) {
      alert("There was a problem saving your image", true);
      $scope.isSavingImage = false;
      $scope.$apply();
    });
  }

  $scope.editUsername = function() {
    $scope.isEditingUsername = true;
  }

  $scope.cancelUsername = function() {
    $scope.isEditingUsername = false;
    $scope.newuser.username = $scope.user.username;
  }

  $scope.saveUsername = function() {
    saveUser({ username: $scope.newuser.username })
    .then(function() {
      alert("Your username has been updated");
      $scope.isEditingUsername = false;
      $scope.$apply();
    })
    .catch(function(err) {
      alert("There was a problem saving your username", true);
      $scope.$apply();
    });
  }

  $scope.editEmail = function() {
    $scope.isEditingEmail = true;
  }

  $scope.cancelEmail = function() {
    $scope.isEditingEmail = false;
    $scope.newuser.email = $scope.user.email;
  }

  $scope.saveEmail = function() {
    saveUser({ email: $scope.newuser.email })
    .then(function() {
      alert("Your email has been updated");
      $scope.isEditingEmail = false;
      $scope.$apply();
    })
    .catch(function(err) {
      alert("There was a problem saving your email", true);
      $scope.$apply();
    });
  }

  $scope.editBio = function() {
    $scope.isEditingBio = true;
  }

  $scope.cancelBio = function() {
    $scope.isEditingBio = false;
    $scope.newuser.bio = $scope.user.bio;
  }

  $scope.saveBio = function() {
    saveUser({ bio: $scope.newuser.bio })
    .then(function() {
      alert("Your bio has been updated");
      $scope.isEditingBio = false;
      $scope.$apply();
    })
    .catch(function(err) {
      alert("There was a problem saving your bio", true);
      $scope.$apply();
    });
  }

  $scope.savePassword = function() {
    saveUser({ password: $scope.newuser.password })
    .then(function() {
      alert("Your password has been updated");
      $scope.$apply();
    })
    .catch(function(err) {
      alert("There was a problem saving your password", true);
      $scope.$apply();
    });
  }

  function copyUser(user) {
    var newuser = {};
    for (var prop in user) {
      newuser[prop] = user[prop];
    }
    return newuser;
  }

  function saveUser(user) {
    return UserService.updateUser($scope.user.id, user)
    .then(function(updatedUser) {
      $scope.user = updatedUser;
      loggedInUser = updatedUser;
      $scope.newuser = copyUser($scope.user);
      $scope.$apply();
    });
  }
}]);
