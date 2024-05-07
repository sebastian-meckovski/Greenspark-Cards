import { IProductWidget } from "seb-components-library";
import { productWidgets } from "./InitialData";

export const fetchData = () => {
    return new Promise<IProductWidget[]>(resolve =>
        setTimeout(() => {
            resolve(productWidgets);
        }, 500)
    );
};
