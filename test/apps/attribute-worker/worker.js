/* global fetch */
import TEST_CASES from './test-cases';
import * as Layers from '@deck.gl/layers';

export default self => {
  self.onmessage = evt => {
    const testCase = TEST_CASES[evt.data.id];

    fetchJSON(testCase.data).then(data => {
      const LayerType = Layers[testCase.type] || Layers[`_${testCase.type}`];
      const {props, transferList} = getLayerSnapshot(new LayerType({...testCase, data}));
      self.postMessage(props, transferList);
    });
  };
};

function fetchJSON(url) {
  return fetch(url).then(resp => resp.json());
}

function getLayerSnapshot(layer) {
  // Initialize the layer
  layer.context = {};
  layer._initialize();

  // Extract generated attributes - should move to AttributeManager
  const {attributeManager} = layer.state;
  const {attributes} = attributeManager;
  const props = {
    type: layer.constructor.name,
    numInstances: layer.getNumInstances()
  };

  if ('vertexCount' in layer.state) {
    props.vertexCount = layer.state.vertexCount;
  }

  const transferList = [];

  for (const attributeName in attributes) {
    const attribute = attributes[attributeName];
    let slimAttribute;

    if (ArrayBuffer.isView(attribute.value)) {
      slimAttribute = attribute.value;
      transferList.push(attribute.value.buffer);
    } else {
      slimAttribute = {
        constant: attribute.constant,
        value: attribute.value
      };
    }
    props[attributeName] = slimAttribute;
  }

  // Release resources
  layer._finalize();

  return {props, transferList};
}
