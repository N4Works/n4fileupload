"use strict";

describe('n4FileUploadService', function()
{
  describe('provider', function () {
    var provider;

    beforeEach(module('n4FileUpload.services', function (n4FileUploadServiceProvider) {
      provider = n4FileUploadServiceProvider;
    }));

    describe('provider', function () {
      it('should be able to set endpoint', inject(function () {
        provider.endpoint = 'http://endpoint/';
        expect(provider.endpoint).toEqual('http://endpoint/');
      }));
    });
  });

  describe('service', function () {
    var _http, _httpBackend, _URL;
    var n4FileUploadService, _Upload;

    beforeEach(module('n4FileUpload.services', function (n4FileUploadServiceProvider) {
      _URL = 'http://endpoint/';
      n4FileUploadServiceProvider.endpoint = _URL;
    }));

    beforeEach(inject(function ($injector) {
      n4FileUploadService = $injector.get('n4FileUploadService');
      _http = $injector.get('$http');
      _Upload = $injector.get('Upload');
      _httpBackend = $injector.get('$httpBackend');
    }));

    describe('post', function () {
      beforeEach(function () {
        spyOn(_Upload, 'upload').and.callFake(function () {
          return {};
        });
      });

      it('should call upload from Upload with provider endpoint and file', function () {
        var file = {};
        expect(n4FileUploadService.send(file)).toBeDefined();
        expect(_Upload.upload).toHaveBeenCalledWith({
          url: _URL,
          file: file
        });
      });

      it('should call upload from Upload with parameter endpoint and file', function () {
        var file = {};
        expect(n4FileUploadService.send(file, 'endpoint')).toBeDefined();
        expect(_Upload.upload).toHaveBeenCalledWith({
          url: 'endpoint',
          file: file
        });
      });
    });
  });

});
