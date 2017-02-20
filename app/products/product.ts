module app.domain {
    
    interface IProduct {
        productId: number;
        productName: string;
        productCode: string;
        releaseData: Date;
        price: number;
        description: string;
        imageUrl: string;
        calculateDiscount(percent: number): number;
    }
    
}