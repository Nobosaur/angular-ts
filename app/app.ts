module app {
    var main = angular.module("productManagement", 
                                ["ngRoute","common.services","productResourceMock"]);

    main.config(routeConfig);

    routeConfig.$inject = ["$routeProvider"];
    function routeConfig($routeProvider: ng.route.IRouteProvider): void {

        $routeProvider
            .when("/productList", {
                    templateUrl: "/app/products/productListView.html",
                    controller: "ProductListController as vm"
                })
            .when("/productDetail/:productId",
                {
                    templateUrl: "/app/products/productDetailView.html",
                    controller: "ProductDetailController as vm"
                })
            .otherwise("/productList");
    }
}