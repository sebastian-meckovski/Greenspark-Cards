import { IProductWidget, productWidgetColors } from "seb-components-library";

export const productWidgets: IProductWidget[] = [
    {
        id: 1,
        type: "carbon",
        action: "collects",
        amount: 100,
        active: true,
        linked: false,
        selectedColor: productWidgetColors.blue
    },
    {
        id: 2,
        type: "plastic bottles",
        action: "plants",
        amount: 200,
        active: false,
        linked: true,
        selectedColor: productWidgetColors.green
    },
    {
        id: 3,
        type: "trees",
        action: "offsets",
        amount: 300,
        active: false,
        linked: false,
        selectedColor: productWidgetColors.beige
    }
];
