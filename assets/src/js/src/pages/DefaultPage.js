/**
 * @class DefaultPage
 */
var DefaultPage = (function () {
    /**
     * @var DefaultPage
     */
    var self;

    return {
        init: function () {
            self = this;
            DetectMobile.init();
            photoVideoPopup.init();
            console.log('DefaultPage init');
        }
    }
})();
