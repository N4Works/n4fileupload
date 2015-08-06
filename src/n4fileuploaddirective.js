'use strict';

(function (ng) {
  ng
    .module('n4FileUpload.directives', [
      'n4FileUpload.services'
    ])
    .directive('n4FileUploadDirective', [
      '$timeout',
      'n4FileUploadService',
      function ($timeout, service) {
        return {
          require: 'ngModel',
          restrict: 'A',
          scope: {
            notificar: '&n4FileUploadDirective'
          },
          replace: true,
          link: function (scope, element, attrs, controller) {
            element.on('change', function (event) {
              service.send(event.target.files)
                .then(function (urls) {
                  if (attrs.multiple) {
                    controller.$setViewValue(urls);
                  } else {
                    controller.$setViewValue(urls[0]);
                  }
                  scope.notificar();
                });
            });

            scope.$on('$destroy', function () {
              element.off('change');
            });
          }
        };
      }]);
}(angular))
