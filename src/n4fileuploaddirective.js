(function(ng) {
  "use strict";

  ng
    .module("n4FileUpload.directives", [
      "n4FileUpload.services"
    ])
    .directive("n4FileUploadDirective", [
      "$timeout",
      "n4FileUploadService",
      "$q",
      "$log",
      function($timeout, service, $q, $log) {
        return {
          require: "ngModel",
          restrict: "AE",
          replace: true,
          transclude: true,
          scope: {
            endpoint: "@",
            onStart: "&",
            onProgress: "=",
            onFinish: "&"
          },
          template: [
            "<label class=\"bt\">",
            "  <span ng-transclude=\"\"></span>",
            "  <input class=\"bt-input\" type=\"file\"/>",
            "</label>"
          ].join(""),
          link: function(scope, element, attrs, controller) {
            var input = element.find("input");

            if (!!attrs.multiple) {
              input.attr("multiple", "multiple");
            }

            scope.files = [];
            input.on("change", function(event) {
              scope.onStart();

              element.addClass("sending");
              input.prop("disabled", true);

              var promises = [],
                files = event.target.files,
                promise;
              for (var i = (files.length - 1); i >= 0; i -= 1) {
                scope.files.push(files[i]);

                promise = service.send(files[i], scope.endpoint)
                  .then(null,
                    function(e) {
                      $log.error(e);
                    },
                    function(event) {
                      var file = event.config.file;
                      file.progress = parseInt(event.loaded * 100 / event.total, 10);
                      if (!!scope.onProgress) {
                        scope.onProgress(file);
                      }
                    });

                promises.push(promise);
              }

              $q.all(promises)
                .then(function(responses) {
                  try {
                    var data = responses.map(function(x) {
                      return x.data[0];
                    });
                    controller.$setViewValue(data);
                  } catch (e) {
                    $log.error(e);
                    controller.$setViewValue(responses);
                  }
                })
                .finally(function() {
                  element.removeClass("sending");
                  input.prop("disabled", false);
                  scope.onFinish();
                });
            });

            scope.$on("$destroy", function() {
              input.off("change");
            });
          }
        };
      }
    ]);
}(angular));
