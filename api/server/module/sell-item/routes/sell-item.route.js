const sellItemController = require('../controllers/sell-item.controller');
const folderController = require('../controllers/folder.controller');
const { router } = require('..');

module.exports = (router) => {
  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {post} /v1/reate-sell-item  Create new sell item
   * @apiDescription Create new sell item
   * @apiUse authRequest
   * @apiPermission all
   */
  router.post(
    '/v1/sell-item',
    Middleware.isAuthenticated,
    sellItemController.createSellItem,
    Middleware.Response.success('create')
  );


 
  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item  Get list sell items
   * @apiDescription Get list sell items
   * @apiPermission admin
   */

  router.get(
    '/v1/sell-item',
    Middleware.hasRole('admin'),
    sellItemController.search,
    Middleware.Response.success('search')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item/me  Get list sell items
   * @apiDescription Get list sell items
   * @apiPermission user
   */

  router.get(
    '/v1/sell-item/model',
    Middleware.isAuthenticated,
    sellItemController.modelSellItem,
    Middleware.Response.success('modelSellItem')
  );

  router.get(
    '/v1/sell-items/model',
    Middleware.isAuthenticated,
    sellItemController.modelSellItems,
    Middleware.Response.success('modelSellItem')
  );
  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item/me  Get list sell items
   * @apiDescription Get list sell items
   * @apiPermission model
   */

  router.get(
    '/v1/sell-item/me',
    Middleware.isAuthenticated,
    sellItemController.mySellItem,
    Middleware.Response.success('mySellItem')
  );


  router.get(
    '/v1/pending-item/me',
    Middleware.isAuthenticated,
    sellItemController.myPendingItem,
    Middleware.Response.success('myPendingItem')
  );

  router.get(
    '/v1/pending-videoItem/me',
    Middleware.isAuthenticated,
    sellItemController.myPendingVideoItem,
    Middleware.Response.success('myPendingVideoItem')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item  Get detail sell item
   * @apiDescription Get detail sell item
   * @apiPermission all
   */

  router.get(
    '/v1/sell-item/:itemId',
    Middleware.isAuthenticated,
    sellItemController.findOne,
    Middleware.Response.success('sellItem')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {post} /v1/sell-item  Update  sell item
   * @apiDescription Update sell item
   * @apiUse authRequest
   * @apiPermission all
   */
  router.put(
    '/v1/sell-item/:itemId',
    Middleware.isAuthenticated,
    sellItemController.findOne,
    sellItemController.validatePermission,
    sellItemController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {delete} /v1/sell-item/:itemId Remove a photo
   * @apiDescription Remove a sell item
   * @apiUse authRequest
   * @apiParam {String}  itemId
   * @apiPermission user
   */
  router.delete(
    '/v1/sell-item/:itemId',
    Middleware.isAuthenticated,
    sellItemController.remove,
    Middleware.Response.success('remove')
  );


  // folder routes

  router.post(
    '/v1/create-folder',
    Middleware.isAuthenticated,
    folderController.createFolder,
    Middleware.Response.success('create')
  );

  // get folder route
  router.get(
    '/v1/folders',
    Middleware.isAuthenticated,
    folderController.getFolders,
    Middleware.Response.success('folders')
  );


  router.get(
    '/v1/folder-images',
    Middleware.isAuthenticated,
    folderController.getFoldersWithImages,
    Middleware.Response.success('folderswith images')
  );

   // create blogs posts
 router.post(
  '/v1/blog-post',
  Middleware.isAuthenticated,
  sellItemController.createBlogPost,
  Middleware.Response.success('create')
);


router.get(
  '/v1/blogs/:userId',
  Middleware.isAuthenticated,
  sellItemController.getAllBlogs,
  Middleware.Response.success('getAllBlogs')
);

router.get(
  '/v1/getBlogPost/:id',
  Middleware.isAuthenticated,
  sellItemController.getBlogById,
  Middleware.Response.success('getBlogById')
);

router.get(
  '/v1/test', sellItemController.test)
};

