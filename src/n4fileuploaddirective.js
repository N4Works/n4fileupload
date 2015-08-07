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
            text: '@',
            notify: '&n4FileUploadDirective'
          },
          template: [
            '<label>',
            '  <figure></figure>',
            '  {{text}}',
            '  <input class="bt-arquivo" type="file"/>',
            '</label>'
          ].join(''),
          replace: true,
          link: function (scope, element, attrs, controller) {
            element.find('label').addClass(attrs.buttonClass);
            element.find('figure').addClass(attrs.iconClass);
            element.find('input').addClass(attrs.inputClass);

            element.on('change', function (event) {
              service.send(event.target.files)
                .then(function (data) {
                  controller.$setViewValue(data);
                  scope.notify();
                });
            });

            scope.$on('$destroy', function () {
              element.off('change');
            });
          }
        };
      }]);
}(angular))
