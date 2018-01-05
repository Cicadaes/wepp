var Main = function () {
    this.index = function (req, resp, params) {
        this.respond({ params: params }, {
            format: 'html'
            , template: 'app/views/main/index'
        });
    };
};

exports.Main = Main;