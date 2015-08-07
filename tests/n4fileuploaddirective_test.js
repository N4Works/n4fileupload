"use strict";

describe('n4FileUploadDirective', function () {
  var rootScope, scope, compile, n4FileUploadServiceStub, promiseStub;

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

    scope.notify = jasmine.createSpy();
    spyOn($.fn, 'on').and.callThrough();
    spyOn($.fn, 'off').and.callThrough();
    spyOn(rootScope, '$on').and.callThrough();
  }));

  describe('creation', function () {
    var element;

    beforeEach(function () {
      var html = '<div n4-file-upload-directive="notify()" ng-model="data"></div>';

      element = angular.element(html);

      compile(element)(scope);
      scope.$digest();
    });

    it('should be able to read the element', function () {
      expect(element.on).toHaveBeenCalled();
      expect(element).toBeDefined();
    });
  });

  describe('functionality', function () {
    var element;

    beforeEach(function () {
      var html = '<div n4-file-upload-directive="notify()" ng-model="data"></div>';

      element = angular.element(html);

      compile(element)(scope);
      scope.$digest();
    });

    it('should call upload service when a file is selected', function () {
      var event = jQuery.Event('change');
      event.target = {
        files: [{}]
      };
      promiseStub.then.and.callFake(function (callback) {
        callback('teste');
      });
      element.trigger(event);

      expect(n4FileUploadServiceStub.send).toHaveBeenCalledWith(event.target.files);
      expect(promiseStub.then).toHaveBeenCalled();
      expect(scope.data).toEqual('teste');
      expect(scope.notify).toHaveBeenCalled();
    });

    it('should remove change event from element on destroy', function () {
      rootScope.$broadcast('$destroy');

      expect(element.off).toHaveBeenCalledWith('change');
    });
  });
});
