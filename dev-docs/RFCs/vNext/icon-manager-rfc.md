# RFC: Icon Manager 

* **Authors**: Xintong Xia 
* **Date**: December 2018
* **Status**: Draft 

## Abstract

This RFC proposes add `IconManager` class to help manage `IconAtlas` and `IconMapping` used in `IconLayer`.

## Motivation 

Currently `IconLayer` requires user pass `IconAtlas` and `IconMapping` when constructing a `IconLayer` instance. 
But there are some cases that `IconAtlas` can not be decided beforehand, requiring a way to dynamically update. 
For example, the icons may need to be fetched from a remote url.
 
## Proposal: Add **IconManager** class

`IconManager` is responsible for 

- Calculate `IconMapping` to generate an `IconAtlas` with all the required icons based on the size.
- Constructing a `Texture2D` object sufficient to fitting the `IconAtlas`. 
- Loading all the icons and update texture

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
- **getIcon(Function)**: accessor to get each icon
- **onTextureUpdate(Function)**: callback when the texture update
- **padding(Number)**: padding between different icons, default is 4
- **maxCanvasWidth**: max canvas width, default is 1024

### IconMapping generation

Initially, use a simple way to generate the mapping. 

- Traverse all the required icons, build the mapping row by row. 
- Row width is decided by `maxCanvasWidth`.
- Row height is decided by the max height of the icons in that row.
