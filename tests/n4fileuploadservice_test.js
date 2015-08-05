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
    var n4FileUploadService;

    beforeEach(module('n4FileUpload.services', function (n4FileUploadServiceProvider) {
      _URL = 'http://endpoint/';
      n4FileUploadServiceProvider.endpoint = _URL;
    }));

    beforeEach(inject(function ($injector) {
      n4FileUploadService = $injector.get('n4FileUploadService');
      _http = $injector.get('$http');
      _httpBackend = $injector.get('$httpBackend');
    }));

    describe('post', function () {
      it('should send data as FormData and return promise', function () {
        _httpBackend.expectPOST(_URL, function (parametro) {
          return parametro instanceof FormData;
        }).respond(201);

        expect(n4FileUploadService.send([ {} ])).toBeDefined();

        _httpBackend.flush();
      });
    });

    describe('delete', function () {
      it('should be able to delete a file by URL', function () {
        _httpBackend.expectDELETE(_URL + '?url=url_de_delecao').respond(204);

        expect(n4FileUploadService.delete('url_de_delecao')).toBeDefined();

        _httpBackend.flush();
      });
    });
  });

});
