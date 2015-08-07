"use strict";

describe('n4FileUploadDirective', function () {
  var rootScope, scope, compile;

  beforeEach(module('n4FileUpload.directives'));

  beforeEach(inject(function ($injector) {
    rootScope = $injector.get('$rootScope');
    scope = rootScope.$new();
    compile = $injector.get('$compile');
  }));

  describe('criação', function () {
    var element;

    beforeEach(function () {
      var html = '<div n4-file-upload-directive="notificar" ng-model="url"></div>';

      element = angular.element(html);

      compile(element)(scope);
      scope.$digest();
    });

    it('deve ter o elemento criado e disponível', function () {
      expect(element).toBeDefined();
    });
  });
});
