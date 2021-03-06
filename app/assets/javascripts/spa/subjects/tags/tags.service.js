(function() {
  'use strict';

  angular.module('spa.subjects')
    .factory('spa.subjects.Tag', TagFactory);

  TagFactory.$inject = ['$resource', 'spa.config.APP_CONFIG'];
  function TagFactory($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + '/api/tags/:id',
      { id: '@id' }, {
        query: { method: 'GET', isArray: true },
        update: { method: 'PUT' },
        associate_things: { method: 'POST',
          url: APP_CONFIG.server_url + '/api/tags/:id/associated_things'
        }, associated_things: { method: 'GET', isArray: true,
          url: APP_CONFIG.server_url + '/api/tags/:id/associated_things'
        }, linkable_things: { method: 'GET', isArray: true,
          url: APP_CONFIG.server_url + '/api/tags/:id/linkable_things'
        }
      }
    );
  }
}());
