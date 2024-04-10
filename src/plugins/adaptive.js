// document.documentElement.style.fontSize = window.innerWidth / 375 * 100 + "px";
new (function () {
    var _self = this;
    _self.width = 375; // 设置默认最大宽度
    _self.fontSize = 100; // 默认字体大小
    _self.widthProportion = function () {
        var p =
            (document.getElementsByTagName("html")[0].offsetWidth || (document.body && document.body.clientWidth)) / _self.width;
        return p >= 2.5 ? 1 : p < 2.5 && p >= 1.5 ? 1 : p >= 1 && p < 1.5 ? 1 : p <= 0.5 ? 0.5 : p;
    };
    _self.changePage = function () {
        document
            .getElementsByTagName("html")[0]
            .setAttribute("style", "font-size:" + _self.widthProportion() * _self.fontSize + "px !important");
    };
    _self.changePage();
    window.addEventListener(
        "resize",
        function () {
            _self.changePage();
        },
        false
    );
})();
