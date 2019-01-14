(function() {
  'use strict';

  angular.module('esn.collaboration')
    .controller('ESNCollaborationMembershipRequestsWidgetController', ESNCollaborationMembershipRequestsWidgetController);

  function ESNCollaborationMembershipRequestsWidgetController($rootScope, esnCollaborationClientService, ESN_COLLABORATION_MEMBER_EVENTS) {
    var self = this;

    self.error = false;
    self.loading = false;
    self.updateRequests = updateRequests;
    self.$onDestroy = $onDestroy;
    self.$onInit = $onInit;

    function $onInit() {
      self.unregisterDeclined = $rootScope.$on(ESN_COLLABORATION_MEMBER_EVENTS.DECLINED, removeRequestEntry);
      self.unregisterAccepted = $rootScope.$on(ESN_COLLABORATION_MEMBER_EVENTS.ACCEPTED, removeRequestEntry);

      self.updateRequests();
    }

    function $onDestroy() {
      self.unregisterDeclined();
      self.unregisterAccepted();
    }

    function removeRequestEntry(event, data) {
      if (!data.collaboration || data.collaboration.id !== self.collaboration._id) {
        return;
      }
      self.requests = self.requests.filter(function(request) {
        return request.user._id !== data.user;
      });
    }

    function updateRequests() {
      self.loading = true;
      self.error = false;
      esnCollaborationClientService.getRequestMemberships(self.objectType, self.collaboration._id).then(function(response) {
        self.requests = response.data || [];
      }, function(err) {
        self.error = err.status;
      }).finally(function() {
        self.loading = false;
      });
    }
  }
})();
