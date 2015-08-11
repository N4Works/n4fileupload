"use strict";

;
(function (ng) {
  ng
    .module('n4FileUpload.services', [])
    .provider('n4FileUploadService', function () {
      var self = this;
      this.endpoint = '';

      this.$get = [
        'Upload',
        '$q',
        function (Upload, $q) {
          return {
            send: function (files, endpoint) {
              var deferred = $q.defer();

              var progress= [];
              var promises = [];
              for (var i = (files.length - 1); i >= 0; i -= 1) {
                progress.unshift({});
                promises.push(Upload.upload({
                  url: endpoint || self.endpoint,
                  file: files[i]
                }).then(null, null, function (event) {
                  progress[i].loaded = event.loaded;
                  progress[i].total = event.total;
                  deferred.notify(progress);
                }));
              }

              $q.all(promises).then(deferred.resolve, deferred.reject);

              return deferred.promise;
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
