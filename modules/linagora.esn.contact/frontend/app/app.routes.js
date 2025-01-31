(function(angular) {
  'use strict';

  angular.module('linagora.esn.contact')
    .config(function($stateProvider, $urlRouterProvider, routeResolver) {
      $urlRouterProvider.when('/contact', '/contact/addressbooks/');

      $stateProvider
        .state('contact', {
          url: '/contact',
          templateUrl: '/contact/app/app.html',
          resolve: {
            isModuleActive: isModuleActive
          }
        })
        .state('contact.search', {
          url: '/search?q',
          params: {
            q: {
              value: '',
              squash: true
            }
          },
          views: {
            'main@contact': {
              templateUrl: '/contact/app/search/contact-search-result.html',
              controller: 'ContactSearchController',
              controllerAs: 'ctrl',
              resolve: {
                domain: routeResolver.session('domain'),
                user: routeResolver.session('user')
              }
            }
          }
        })
        .state('contact.addressbooks', {
          url: '/addressbooks/:bookName',
          views: {
            'main@contact': {
              templateUrl: '/contact/app/contact/list/contact-list.html',
              controller: 'ContactListController',
              controllerAs: '$ctrl',
              resolve: {
                domain: routeResolver.session('domain'),
                user: routeResolver.session('user')
              }
            }
          }
        })
        .state('contact.addressbooks.settings', {
          url: '/settings',
          views: {
            'main@contact': {
              template: '<contact-addressbook-settings />'
            }
          }
        })
        .state('contact.addressbooks.new', {
          url: '^/contact/new/:bookId/:bookName',
          views: {
            'main@contact': {
              templateUrl: '/contact/app/contact/create/contact-create.html',
              controller: 'newContactController',
              resolve: {
                domain: routeResolver.session('domain'),
                user: routeResolver.session('user')
              }
            }
          }
        })
        .state('contact.addressbooks.show', {
          url: '^/contact/show/:bookId/:bookName/:cardId',
          views: {
            'main@contact': {
              templateUrl: '/contact/app/contact/show/contact-show.html',
              controller: 'showContactController',
              resolve: {
                domain: routeResolver.session('domain'),
                user: routeResolver.session('user')
              }
            }
          }
        })
        .state('contact.addressbooks.edit', {
          url: '^/contact/edit/:bookId/:bookName/:cardId',
          views: {
            'main@contact': {
              templateUrl: '/contact/app/contact/edit/contact-edit.html',
              controller: 'editContactController',
              resolve: {
                domain: routeResolver.session('domain'),
                user: routeResolver.session('user')
              }
            }
          }
        });

        function isModuleActive($location, contactConfiguration) {
          return contactConfiguration.get('enabled', true).then(function(isEnabled) {
            if (!isEnabled) {
              $location.path('/');
            }
          }).catch(function() {
            $location.path('/');
          });
        }
    });
})(angular);
