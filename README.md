# n4Fileupload
[![Build Status](https://secure.travis-ci.org/N4Works/n4fileupload.png?branch=master)](https://travis-ci.org/N4Works/n4fileupload)
[![Coverage Status](https://coveralls.io/repos/N4Works/n4fileupload/badge.svg?branch=master&service=github)](https://coveralls.io/r/N4Works/n4fileupload/?branch=master)

## about

  A simple module to upload files and notify progress.

## how to install

```
bower install n4-fileUpload-directive --save
```

## how to use

#### HTML
```
<n4-file-upload class="btn" on-start="ctrl.onStart()" on-progress="ctrl.onProgress" on-finish="ctrl.onFinish()" ng-model="ctrl.files" multiple="true">
  <i class="icon attachment"></i>
  Add file
</n4-file-upload>
```

The directive works with transclusion for HTML template.

- on-start: Event called when upload begins.
- on-progress: Event called for each file progress.
- on-finish: Event called when all files were uploaded.
- ng-model: Files selected.
- multiple: Allow the selection of multiple files.
- endpoint: Optional URL.

You can configure a global URL using the "config".
  
#### Javascript

```
angular.module('n4FileUploadApp', ['n4FileUpload'])
    .config(function (n4FileUploadServiceProvider) {
      n4FileUploadServiceProvider.endpoint = '<YOUR_ENDPOINT_FOR_UPLOAD>';
    })
    .controller('RootController', function () {
      var self = this;
      self.files = [];
      self.onStart = function () {
        console.log('Started');
      };
      self.onProgress = function (file) {
        console.log(file.name);
        console.log(file.loaded);
        console.log(file.total);
        console.log(file.progress);
      };
      self.onFinish = function () {
        console.log('Finished');
      };
    });
```
##LICENSE

MIT
