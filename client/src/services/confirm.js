app.service("confirm", function($rootScope) {
  return function(msg, ok, cancel, isWarning) {
    $rootScope.$broadcast('confirm', {
      message: msg,
      ok: ok,
      cancel: cancel,
      isWarning: isWarning
    });
  }
});
