var assert = require('chai').assert;
var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');
var moment = require('moment');
var TestHelpers = require('../../support/TestHelpers');
var ExplorerValidations = require('../../../client/js/app/validations/ExplorerValidations');

describe('validations/ExplorerValidations', function() {

  describe('explorer query validations', function () {
    describe('event_collection', function () {
      it('has an error message', function () {
        var errorMessage = ExplorerValidations.explorer.event_collection.msg;
        assert.equal(errorMessage, 'Choose an Event Collection.');
      });

      it('returns true when event_collection is present', function () {
        assert.isTrue(ExplorerValidations.explorer.event_collection.validator({ query: { event_collection: 'value' } }));
      });

      it('returns false when event_collection is falsy', function () {
        assert.isFalse(ExplorerValidations.explorer.event_collection.validator({ query: { event_collection: '' } }));
      });
    });

    describe('refresh_rate validations', function() {
      it('has an error message', function () {
        var errorMessage = ExplorerValidations.explorer.refresh_rate.msg;
        assert.equal(errorMessage, 'Refresh rate must be between 4 and 24 hours.');
      });

      it('returns true when refresh rate is between 4 and 24 hours or 0', function() {
        assert.isTrue(ExplorerValidations.explorer.refresh_rate.validator({
          refresh_rate: 0
        }));
        assert.isTrue(ExplorerValidations.explorer.refresh_rate.validator({
          refresh_rate: 1440
        }));
        assert.isTrue(ExplorerValidations.explorer.refresh_rate.validator({
          refresh_rate: 2000
        }));
      });

      it('returns false when refresh_rate is out of range', function() {
        assert.isFalse(ExplorerValidations.explorer.refresh_rate.validator({
          refresh_rate: 1000
        }));
        assert.isFalse(ExplorerValidations.explorer.refresh_rate.validator({
          refresh_rate: 90000
        }));
      });
    });

    describe('query name', function () {
      it('has an error message', function () {
        var errorMessage = ExplorerValidations.explorer.query_name.msg;
        assert.equal(errorMessage, 'You must give your saved query a name.');
      });

      it('returns true even when the value is not valid when saving is false', function () {
        var explorer = TestHelpers.createExplorerModel();
        explorer.saving = false;
        explorer.query_name = '';
        assert.isTrue(ExplorerValidations.explorer.query_name.validator(explorer));
      });

      it('returns false when the value is not valid when saving is true', function () {
        var explorer = TestHelpers.createExplorerModel();
        explorer.saving = true;
        explorer.query_name = '';
        assert.isFalse(ExplorerValidations.explorer.query_name.validator(explorer));
      });

      it('returns true when name is present', function () {
        assert.isTrue(ExplorerValidations.explorer.query_name.validator({ saving: true, query_name: 'a satisfactory value' }));
      });

      it('returns false when name is an empty string', function () {
        assert.isFalse(ExplorerValidations.explorer.query_name.validator({ saving: true, query_name: '' }));
      });

      it('returns false when name is a null', function () {
        assert.isFalse(ExplorerValidations.explorer.query_name.validator({ saving: true, query_name: null }));
      });

      it('returns false when name is a undefined', function () {
        assert.isFalse(ExplorerValidations.explorer.query_name.validator({ saving: true, query_name: undefined }));
      });
    });

    describe('analysis_type', function () {
      it('has an error message', function () {
        var errorMessage = ExplorerValidations.explorer.analysis_type.msg;
        assert.equal(errorMessage, 'Choose an Analysis Type.');
      });

      it('returns true when analysis_type is present', function () {
        assert.isTrue(ExplorerValidations.explorer.analysis_type.validator({ query: { analysis_type: 'value' } }));
      });

      it('returns false when analysis_type is falsy', function () {
        assert.isFalse(ExplorerValidations.explorer.analysis_type.validator({ query: { analysis_type: '' } }));
      });
    });

    describe('filters', function () {
      describe('when query has invalid filters', function () {
        it('has an error message', function () {
          var errorMessage = ExplorerValidations.explorer.filters.msg;
          assert.equal(errorMessage, 'One of your filters is invalid.');
        });
      });

      describe('when query has valid filters', function () {
        it('returns true', function () {
          var filters = [
            {
              property_name: 'click',
              operator: 'eq',
              coercion_type: 'String',
              property_value: 'test string'
            }
          ];
          assert.isTrue(ExplorerValidations.explorer.filters.validator({ query: { filters: filters } }));
        });
      });

      describe('when the query has an invalid filter', function () {
        it('returns false', function () {
          var filters = [
            {
              property_name: 'click',
              operator: 'eq',
              coercion_type: 'Number',
              property_value: 'yoyoyo'
            }
          ];
          assert.isFalse(ExplorerValidations.explorer.filters.validator({ query: { filters: filters } }));
        });
      });

      describe('when query has no filters', function () {
        it('returns true', function () {
          assert.isTrue(ExplorerValidations.explorer.filters.validator({ query: { filters: [] } }));
        });
      });
    });
  });

  describe('emailExtractionExplorer valdiations', function () {
    describe('email', function(){
      it("returns true when email has @ and .", function(){
        assert.isTrue(ExplorerValidations.emailExtractionExplorer.email.validator({ query: { email: "keen@example.com" } }));
      });

      it('returns false when email is missing @ or .', function(){
        assert.isFalse(ExplorerValidations.emailExtractionExplorer.email.validator({ query: { email: "keen@examplecom" } }));
        assert.isFalse(ExplorerValidations.emailExtractionExplorer.email.validator({ query: { email: "keen!example.com" } }));
        assert.isFalse(ExplorerValidations.emailExtractionExplorer.email.validator({ query: { email: "keen#example.com" } }));
        assert.isFalse(ExplorerValidations.emailExtractionExplorer.email.validator({ query: { email: "keen$example.com" } }));
      });
    });

    describe('latest', function () {
      describe('evaluates strings correctly', function () {
        it('should return true for 10', function () {
          assert.isTrue(ExplorerValidations.emailExtractionExplorer.latest.validator({ query: { latest: '10' } }));  
        });

        it('should return false for 10.1', function () {
          assert.isFalse(ExplorerValidations.emailExtractionExplorer.latest.validator({ query: { latest: '10.1' } }));
        });

        it('should return false for 10.00', function () {
          assert.isFalse(ExplorerValidations.emailExtractionExplorer.latest.validator({ query: { latest: '10.00' } }));
        });
      });
    });
  });
});