var app;
(function (app) {
    var productDetail;
    (function (productDetail) {
        var ProductDetailController = (function () {
            function ProductDetailController($routeParams, dataAccessService) {
                var _this = this;
                this.$routeParams = $routeParams;
                this.dataAccessService = dataAccessService;
                this.title = "Product details";
                var id = $routeParams.productId;
                var productResource = dataAccessService.getProductResource();
                productResource.get({ productId: id }, function (data) {
                    _this.product = data;
                });
            }
            return ProductDetailController;
        }());
        ProductDetailController.$inject = ["$routeParams", "dataAccessService"];
        angular
            .module("productManagement")
            .controller("ProductDetailController", ProductDetailController);
    })(productDetail = app.productDetail || (app.productDetail = {}));
})(app || (app = {}));
