MyGuideApp.factory('AuthTokenInterceptor', function($q) {
  return {
    // optional method
    'request': function(config) {
      // do something on success

      // Detect calls to my guide API
      if (config.url.indexOf("myguidemvc.azurewebsites.net/api") > -1) {
        console.log("AuthTokenInterceptor", config);
        config.headers['Authorization'] = "Bearer " + "N5IopRWWDbjFfVVZK9WBIVZv63p9bxCSd_aBaQXax2-_TUMNtD5_M-WrNvyzeWNOvjwSEYZhbE4V6prI-_4wKx34EZO3rXcXkLY6WYzqVfrjWIGRCXOWpEeZldyeCw8tIvccTGoVIXzeRfU4dWcczyfT05en8qCINaG2-OW7zdfroshIPXHJNLulI6dLnNP2Yn4EIKZ07RogweL5Ih4cJhWo2SP-cLZXoiX7OYBP6_V5DnBh7wQN-F8E64DBfZe760qlmubgrsOfLO1ypMPyeAcLcUWSWXEDuu0N3jPvEdFtCc-J9xjVO2fRUWZtz4iQnJ9lYqWlpaYEjzw3umfRlZz6o64jZANxNoLHFzsk6dqVf6MA1V5dbdTzUHzPyhFmWfwlSKIbhjC2B_arKwM6MlnnfLgz2KxIvFGV3n-wVWPcJ6ZpjnT4I_FQcBhJq943oMpBSkk_SgF6uZJvr1lEzgEa4voJ1dAXlUkdvXseIoih7vRz3junNte35p2RpdPh";
      }

      return config;
    },

   //  // optional method
   // 'requestError': function(rejection) {
   //    // do something on error
   //    if (canRecover(rejection)) {
   //      return responseOrNewPromise
   //    }
   //    return $q.reject(rejection);
   //  },



   //  // optional method
   //  'response': function(response) {
   //    // do something on success
   //    return response;
   //  },

   //  // optional method
   // 'responseError': function(rejection) {
   //    // do something on error
   //    if (canRecover(rejection)) {
   //      return responseOrNewPromise
   //    }
   //    return $q.reject(rejection);
   //  }
  };
});


