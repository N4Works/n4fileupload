"use strict";

describe('n4FileUploadDirective', function () {
  var rootScope, scope, compile, n4FileUploadServiceStub, promiseStub, log;

  beforeEach(module('n4FileUpload.directives', function ($provide) {
    n4FileUploadServiceStub = jasmine.createSpyObj('UploadService', ['send', 'delete']);
    promiseStub = jasmine.createSpyObj('Promise', ['then', 'catch']);
    n4FileUploadServiceStub.send.and.returnValue(promiseStub);
    $provide.value('n4FileUploadService', n4FileUploadServiceStub);
  }));

  beforeEach(inject(function ($injector) {
    rootScope = $injector.get('$rootScope');
    scope = rootScope.$new();
    compile = $injector.get('$compile');
    log = $injector.get('$log');

    scope.onStart = jasmine.createSpy();
    scope.onFinish = jasmine.createSpy();
    spyOn($.fn, 'on').and.callThrough();
    spyOn($.fn, 'off').and.callThrough();
    spyOn($.fn, 'addClass').and.callThrough();
    spyOn($.fn, 'prop').and.callThrough();
    spyOn(rootScope, '$on').and.callThrough();
    spyOn(log, 'error').and.callThrough();
  }));

  describe('creation', function () {
    var element;

    beforeEach(function () {
      var html = '<n4-file-upload-directive on-start="onStart" on-finish="onFinish" ng-model="data">Send file</n4-file-upload-directive>';

      element = angular.element(html);

      compile(element)(scope);
      scope.$digest();
    });

    it('should be able to read the element', function () {
      expect(element).toBeDefined();
      expect(element.find('input').on).toHaveBeenCalled();
    });

    it('should have the text', function () {
      expect(element.find('span').html()).toBe('<span class="ng-scope">Send file</span>');
    });
  });

  describe('functionality', function () {
    var element;

    beforeEach(function () {
      var html = '<n4-file-upload-directive on-start="onStart" on-finish="onFinish" ng-model="data">Send file</n4-file-upload-directive>';

      element = angular.element(html);

      compile(element)(scope);
      scope.$digest();
    });

    it('should update progress on upload', function () {
      var event = jQuery.Event('change');
      var file1 = {name:'file1'};
      var file2 = {name:'file2'};
      event.target = {
        files: [{name:'file1'}, {name:'file2'}]
      };

      promiseStub.then.and.callFake(function (success, fail, progress) {
        progress({
          loaded: 100,
          total: 100,
          config: {
            file: file1
          }
        });
        progress({
          loaded: 200,
          total: 200,
          config: {
            file: file2
          }
        });
      });

      element.find('input').trigger(event);

      expect(element.find('input').addClass).toHaveBeenCalledWith('sending');
      expect(element.find('input').prop).toHaveBeenCalledWith('disabled', true);

      expect(n4FileUploadServiceStub.send).toHaveBeenCalledWith(event.target.files[0]);
      expect(n4FileUploadServiceStub.send).toHaveBeenCalledWith(event.target.files[1]);
      expect(promiseStub.then).toHaveBeenCalled();
      expect(file1.progress).toEqual('100%');
      expect(file2.progress).toEqual('100%');
    });

    it('should concatenate all the uploads in one promise', function () {
      var event = jQuery.Event('change');
      var file1 = {name:'file1'};
      var file2 = {name:'file2'};
      event.target = {
        files: [{name:'file1'}, {name:'file2'}]
      };

      promiseStub.then.and.callFake(function (success, fail, progress) {
        progress({
          loaded: 100,
          total: 100,
          config: {
            file: file1
          }
        });
        progress({
          loaded: 200,
          total: 200,
          config: {
            file: file2
          }
        });
      });

      element.find('input').trigger(event);

      expect(element.find('input').addClass).toHaveBeenCalledWith('sending');
      expect(element.find('input').prop).toHaveBeenCalledWith('disabled', true);

      expect(n4FileUploadServiceStub.send).toHaveBeenCalledWith(event.target.files[0]);
      expect(n4FileUploadServiceStub.send).toHaveBeenCalledWith(event.target.files[1]);
      expect(promiseStub.then).toHaveBeenCalled();
      expect(file1.progress).toEqual('100%');
      expect(file2.progress).toEqual('100%');
    });

    it('should log the error on upload', function () {
      var event = jQuery.Event('change');
      var error = new TypeError('Teste');
      var file1 = {name:'file1'};
      var file2 = {name:'file2'};
      event.target = {
        files: [{name:'file1'}, {name:'file2'}]
      };

      promiseStub.then.and.callFake(function (success, fail) {
        fail(error);
      });

      element.find('input').trigger(event);

      expect(element.find('input').addClass).toHaveBeenCalledWith('sending');
      expect(element.find('input').prop).toHaveBeenCalledWith('disabled', true);

      expect(n4FileUploadServiceStub.send).toHaveBeenCalledWith(event.target.files[0]);
      expect(n4FileUploadServiceStub.send).toHaveBeenCalledWith(event.target.files[1]);
      expect(promiseStub.then).toHaveBeenCalled();
      expect(log.error).toHaveBeenCalledWith(error);
    });

    it('should remove change event from element on destroy', function () {
      rootScope.$broadcast('$destroy');

      expect(element.find('input').off).toHaveBeenCalledWith('change');
    });
  });
});
