;
(function(ng) {
  "use strict";

  ng
    .module("n4FileUpload.services", ["ngFileUpload"])
    .provider("n4FileUploadService", function() {
      var self = this;
      this.endpoint = "";

      this.$get = [
        "Upload",
        function(Upload) {
          return {
            send: function(file, endpoint) {
              return Upload.upload({
                url: endpoint || self.endpoint,
                file: file
              });
            }
          };
        }
      ];
    });
}(angular));
