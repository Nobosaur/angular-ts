module app.productDetail {
    interface IProductDetailModule {
        title: string;
        product: app.domain.IProduct;
    }

    interface IProductParams extends ng.route.IRouteParamsService{
        productId: number;

    }

    class ProductDetailController implements IProductDetailModule {
        title: string;
        product: app.domain.IProduct;

        static $inject = ["$routeParams","dataAccessService"];
        constructor(private $routeParams: IProductParams,
                    private dataAccessService: app.common.DataAccessService) {
            this.title = "Product details";

            var id = $routeParams.productId;
            var productResource = dataAccessService.getProductResource();
            productResource.get({productId: id},
                (data: app.domain.IProduct) => {
                this.product = data;
            });
        }
    }

    angular
        .module("productManagement")
        .controller("ProductDetailController", ProductDetailController);
}