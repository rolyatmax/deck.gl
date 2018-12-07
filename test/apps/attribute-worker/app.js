import React, {Component} from 'react';
import {render} from 'react-dom';
import DeckGL from 'deck.gl';
import * as Layers from '@deck.gl/layers';
import createWorker from 'webworkify-webpack';

import TEST_CASES from './test-cases';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  latitude: 37.78,
  longitude: -122.4,
  zoom: 12
};

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {layerData: null};

    this.worker = createWorker(require.resolve('./worker.js'));
    this.worker.onmessage = evt => {
      this.setState({layerData: evt.data});
    };

    this._load(Object.keys(TEST_CASES)[0]);
  }

  _load(id) {
    this.worker.postMessage({id});
  }

  _renderButton(id) {
    return (
      <button key={id} onClick={() => this._load(id)}>
        {id}
      </button>
    );
  }

  render() {
    const {layerData} = this.state;

    const layers = [];
    if (layerData) {
      const LayerType = Layers[layerData.type] || Layers[`_${layerData.type}`];
      layers.push(
        new LayerType({
          id: layerData.type,
          ...layerData,
          pickable: true,
          onClick: console.log // eslint-disable-line
        })
      );
    }

    return (
      <div>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          layers={layers}
          controller={true}
          width="100%"
          height="100%"
        />
        <div style={{position: 'fixed', top: 10, left: 10}}>
          {Object.keys(TEST_CASES).map(this._renderButton, this)}
        </div>
      </div>
    );
  }
}

/* global document */
render(<Root />, document.body.appendChild(document.createElement('div')));
