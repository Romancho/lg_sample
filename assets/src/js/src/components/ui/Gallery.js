/**
 * @class photoVideoPopup
 */

const photoVideoPopup = (function () {
    /**
     * @var photoVideoPopup
     */
    let self;
    return {
        config: {
            imageGalleryClass: '.js-gallery',
            videoGalleryClass: '.js-video-gallery'
        },

        vars: {},

        init: function (config) {
            self = this;
            lightGallery();
            self.initVars();
            // self.galleryInit();
            self.videoInit();

            // console.log('PhotoPopup init');
        },
        initVars: function() {
            self.vars = {
                imageGallery: $(self.config.imageGalleryClass),
                videoGallery: $(self.config.videoGalleryClass)
            }
        },
        videoInit: function() {
            console.log(document.getElementById('gallery-videos-demo'));
            lightGallery(document.getElementById('gallery-videos-demo'));
        }
    }
})();
