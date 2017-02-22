var app;
(function (app) {
    var productList;
    (function (productList) {
        var ProductListController = (function () {
            function ProductListController() {
                this.title = "Product List";
                this.showImage = false;
                this.products = [{
                        "productId": 1,
                        "productName": "Leaf Rake",
                        "productCode": "GDN-0011",
                        "releaseDate": new Date(2009, 2, 19),
                        "description": "Leaf rake with 48-inch wooden handle.",
                        "price": 19.95,
                        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/26215/Anonymous_Leaf_Rake.png"
                    },
                    {
                        "productId": 2,
                        "productName": "Garden Cart",
                        "productCode": "GDN-0023",
                        "releaseDate": new Date(2010, 2, 18),
                        "description": "15 gallon capacity rolling garden cart",
                        "price": 32.99,
                        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/58471/garden_cart.png"
                    },
                    {
                        "productId": 5,
                        "productName": "Hammer",
                        "productCode": "TBX-0048",
                        "releaseDate": new Date(2013, 4, 21),
                        "description": "Curved claw steel hammer",
                        "price": 8.99,
                        "imageUrl": "http://openclipart.org/image/300px/svg_to_png/73/rejon_Hammer.png"
                    }
                ];
                var newProduct = new app.domain.Product(3, "Pila", "TPIL-024", new Date(2017, 4, 4), 16.95, "pila za piljenje,velika", "http://openclipart.org/image/300px/svg_to_png/27070/egore_saw.png");
                newProduct.price = newProduct.calculateDiscount(10);
                this.products.push(newProduct);
            }
            ProductListController.prototype.toggleImage = function () {
                this.showImage = !this.showImage;
            };
            return ProductListController;
        }());
        angular.module("productManagement")
            .controller("ProductListController", ProductListController);
    })(productList = app.productList || (app.productList = {}));
})(app || (app = {}));
