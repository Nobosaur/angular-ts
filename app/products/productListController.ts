module app.productList {

    interface IProductListModule {
        title: string;
        showImage: boolean;
        products: app.domain.IProduct[];
        toggleImage(): void; 
    }

    class ProductListController implements IProductListModule {
        title: string;
        showImage: boolean;
        products: app.domain.IProduct[];

        static $inject = ["dataAccessService"];
        constructor(private dataAccessService: app.common.DataAccessService) {
            this.title = "Product List";
            this.showImage = false;
            this.products = [];
            
            var productResources = dataAccessService.getProductResource();
            productResources.query((data: app.domain.IProduct[]) => {
                this.products = data;
            })
        }

        toggleImage(): void {
            this.showImage = !this.showImage;
        }

    }

    angular.module("productManagement")
        .controller("ProductListController", ProductListController);

}