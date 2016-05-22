import _ from 'lodash';
import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

const LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Maps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: 16,
      center: {lat: 37.599400, lng: 126.865136}
    };
  }

  componentDidMount() {
  }

  _mapEl() {
    const {stores, pick} = this.props;
    const {zoom, center} = this.state;
    var labelIndex = 0;
    return (
      <GoogleMap
        ref="map"
        zoom={zoom}
        center={center}>
        {
          _.map(stores, (store, key) => {
            const label = LABELS[labelIndex++ % LABELS.length];
            return (
              <Marker
                key={key}
                position={{lat: store.lat, lng: store.lon}}
                label={label}
                onClick={() => pick(key, label)} />
            );
          })
        }
      </GoogleMap>
    );
  }

  _mapContainerEl() {
    return (
      <div {...this.props}
        style={{height: '400px', border: '1px solid #ddd'}}>
      </div>
    );
  }

  render() {
    return (
      <Row>
        <Col className="card"
          xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
          <h4>편의점 선택</h4>
          <GoogleMapLoader googleMapElement={this._mapEl()}
            containerElement={this._mapContainerEl()}>
          </GoogleMapLoader>
        </Col>
      </Row>
    );
  }
}

Maps.displayName = 'Maps';
Maps.propTypes = {
  stores: React.PropTypes.object,
  pick: React.PropTypes.func
};
Maps.defaultProps = {
  stores: {}
};

export default Maps;
