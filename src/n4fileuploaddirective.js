'use strict';

(function (ng) {
  ng
    .module('n4FileUpload.directives', [
      'n4FileUpload.services'
    ])
    .directive('n4FileUploadDirective', [
      '$timeout',
      'n4FileUploadService',
      '$q',
      '$log',
      function ($timeout, service, $q, $log) {
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
            '  <span ng-bind="text">Send</span>',
            '  <progress value="{{value}}" max="{{max}}"></progress>',
            '  <input class="bt-arquivo" type="file"/>',
            '</label>'
          ].join(''),
          replace: true,
          link: function (scope, element, attrs, controller) {
            element.addClass(attrs.buttonClass);
            element.find('figure').addClass(attrs.iconClass);
            var input = element.find('input');
            input.addClass(attrs.inputClass);

            if (!!attrs.multiple) {
              input.attr('multiple', 'multiple');
            }

            element.on('change', function (event) {
              element.addClass('sending');
              service.send(event.target.files)
                .then(function (data) {
                  controller.$setViewValue(data);
                  scope.notify();
                }, function (e) {
                  $log.error(e);
                  return $q.reject('Ops, ocorreu uma falha ao tentar gravar o arquivo: ' + e.message);
                }, function (event) {
                  scope.max = event.total;
                  scope.value = event.loaded;
                  console.log(event);
                })
                .finally(function () {
                  element.removeClass('sending');
                });
            });

            scope.$on('$destroy', function () {
              element.off('change');
            });
          }
        };
      }]);
}(angular))
