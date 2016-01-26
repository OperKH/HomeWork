(function() {
  'use strict';

  angular
    .module('jediTool')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
