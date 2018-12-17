# RFC: Icon Manager 

* **Authors**: Xintong Xia 
* **Date**: December 2018
* **Status**: Draft 

## Abstract

This RFC proposes add `IconManager` class to help manage `iconAtlas` and `iconMapping` used in `IconLayer`.

## Motivation 

Currently `IconLayer` requires user pass `iconAtlas` and `iconMapping` when constructing a `IconLayer` instance. 
But there are some cases that `iconAtlas` can not be decided beforehand, requiring a way to dynamically update. 
For example, the icons may need to be fetched from a remote url.

Refer [IconLayer](/docs/layers/icon-layer.md) for details.
 
## Proposal: Add **IconManager** class

`IconManager` is responsible for 

- Calculating `iconMapping` to generate an `iconAtlas` with all the required icons based on the size.
- Constructing a `Texture2D` object sufficient to fit in the `iconAtlas`. 
- Loading all the icons and update texture.

### Constructor

```js
const IconManager = new IconManager(gl, {
  data,
  getIcon,
  onTextureUpdate,
  padding,
  maxCanvasWidth
})
```

### Parameters

- **data(Object)**: data feed into IconLayer
- **getIcon(Function)**: accessor to get icon from each data point
- **onTextureUpdate(Function)**: callback when the texture updates
- **padding(Number)**: padding between different icons, default is 4
- **maxCanvasWidth**: max canvas width for `iconAtlas`, default is 1024

### `iconMapping` generation

Initially, use a simple way to generate the mapping. 

- Traverse all the required icons, build the mapping row by row. 
- Row width is decided by `maxCanvasWidth`.
- Row height is decided by the max height of the icons in that row.

### Update `iconAtlas`
