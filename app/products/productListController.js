var app;
(function (app) {
    var productList;
    (function (productList) {
        var ProductListController = (function () {
            function ProductListController(dataAccessService) {
                var _this = this;
                this.dataAccessService = dataAccessService;
                this.title = "Product List";
                this.showImage = false;
                this.products = [];
                var productResources = dataAccessService.getProductResource();
                productResources.query(function (data) {
                    _this.products = data;
                });
            }
            ProductListController.prototype.toggleImage = function () {
                this.showImage = !this.showImage;
            };
            return ProductListController;
        }());
        ProductListController.$inject = ["dataAccessService"];
        angular.module("productManagement")
            .controller("ProductListController", ProductListController);
    })(productList = app.productList || (app.productList = {}));
})(app || (app = {}));
