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
