import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "@/features/user/userSlice";
import categoryReducer from "@/features/categories/categorySlice";
import productReducer from "../features/products/productSlice";
import uploadReducer from "../features/products/uploadSlice";
import cartReducer from "@/features/cart/cartSlice";
import addressReducer from "@/features/address/addressSlice";
import orderReducer from "@/features/orders/orderSlice";
import adminProductsReducer from "@/features/adminProducts/adminProductSlice";
import giftBoxReducer from "@/features/giftBoxes/giftBoxSlice";
import giftSetReducer from "@/features/giftSet/giftSetSlice";
import brandShowcaseReducer from "@/features/brandShowcases/brandShowcaseSlice";
import heroSectionsReducer from "@/features/heroSections/heroSectionSlice";
import bulkOrderReducer from "@/features/bulkOrders/bulkOrderSlice";
import newsletterReducer from "@/features/newsletter/newsletterSlice";

import wishlistReducer from "@/features/wishlist/wishlistSlice";





export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    upload: uploadReducer,
    user: userReducer,
    cart: cartReducer,
    address: addressReducer,
    orders: orderReducer,
    adminProducts: adminProductsReducer,
    heroSections: heroSectionsReducer,
    giftBoxes: giftBoxReducer,
    giftSet: giftSetReducer,
    brandShowcases: brandShowcaseReducer,
    bulkOrders: bulkOrderReducer,
    newsletter: newsletterReducer,
    wishlist: wishlistReducer,
  },
});