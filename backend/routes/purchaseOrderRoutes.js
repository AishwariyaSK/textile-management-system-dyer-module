import { Router } from "express";
import {createDyerPurchaseOrder, updateDyerPurchaseOrderStatus, getDyerPurchaseOrder, getAllDyerPurchaseOrders, deleteDyerPurchaseOrder, getDyerPurchaseOrderByDyerId} from "../controllers/dyerPurchaseOrderController.js";
import {createBuyerPurchaseOrder, updateBuyerPurchaseOrderStatus, getBuyerPurchaseOrder, getAllBuyerPurchaseOrders, deleteBuyerPurchaseOrder} from "../controllers/buyerPurchaseOrderController.js";
import { authMiddleware, adminMiddleware, allowRoles } from "../middleware/auth.js";


const purchaseOrderRouter = Router();

purchaseOrderRouter.post('/createDyerPurchaseOrder', authMiddleware, adminMiddleware, createDyerPurchaseOrder);
purchaseOrderRouter.post('/createBuyerPurchaseOrder', authMiddleware, allowRoles('buyer'), createBuyerPurchaseOrder); 

purchaseOrderRouter.patch('/updateDyerPurchaseOrderStatus/:id', authMiddleware,allowRoles('admin','dyer'), updateDyerPurchaseOrderStatus); 
purchaseOrderRouter.patch('/updateBuyerPurchaseOrderStatus/:id', authMiddleware, allowRoles('admin','buyer'), updateBuyerPurchaseOrderStatus); 

purchaseOrderRouter.get('/getAllDyerPurchaseOrders', authMiddleware, adminMiddleware, getAllDyerPurchaseOrders);
purchaseOrderRouter.get('/getAllBuyerPurchaseOrders', authMiddleware, adminMiddleware, getAllBuyerPurchaseOrders);

purchaseOrderRouter.get('/getDyerPurchaseOrder/:id', authMiddleware, allowRoles('admin','dyer'), getDyerPurchaseOrder);
purchaseOrderRouter.get('/getBuyerPurchaseOrder/:id', authMiddleware, allowRoles('admin','buyer'), getBuyerPurchaseOrder);

purchaseOrderRouter.delete('/deleteDyerPurchaseOrder/:id', authMiddleware, adminMiddleware, deleteDyerPurchaseOrder);
purchaseOrderRouter.delete('/deleteBuyerPurchaseOrder/:id', authMiddleware, adminMiddleware, deleteBuyerPurchaseOrder);

// With ID param
purchaseOrderRouter.get('/getDyerPurchaseOrderByDyerId/:id', authMiddleware, allowRoles('admin', 'dyer'), getDyerPurchaseOrderByDyerId);

// Without ID param (fallback to req.user._id)
purchaseOrderRouter.get('/getDyerPurchaseOrderByDyerId', authMiddleware, allowRoles('admin', 'dyer'), getDyerPurchaseOrderByDyerId);

export default purchaseOrderRouter;