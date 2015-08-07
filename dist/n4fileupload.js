"use strict";

;
(function (ng) {
  ng
    .module('n4FileUpload', ['n4FileUpload.services', 'n4FileUpload.directives'])
}(angular))

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

"use strict";

;
(function (ng) {
  ng
    .module('n4FileUpload.services', [])
    .provider('n4FileUploadService', function () {
      var self = this;
      this.endpoint = '';

      this.$get = [
        '$http',
        function ($http) {
          return {
            send: function (files, endpoint) {
              var formData = new FormData();
              for (var i = (files.length - 1); i >= 0; i -= 1) {
                formData.append('file_' + i, files[i]);
              }

              return $http({
                method: 'POST',
                url: endpoint || self.endpoint,
                headers: {'Content-Type': undefined},
                data: formData
              }).then(function (response) {
                return response.data;
              });
            },
            delete: function (fileUrl, endpoint) {
              return $http.delete(endpoint || self.endpoint, {params: {url: fileUrl}})
                .then(function (response) {
                  return response.data;
                });
            }
          };
        }];
    });
}(angular))
