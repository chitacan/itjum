import _ from 'lodash';
import m from 'moment';
import React from 'react';
import {Row, Col, Table, Label} from 'react-bootstrap';

const Stock = props => {
  const {name, stock, label, store} = props;
  const updated = store.updated ?
    m(store.updated).format('YYYY. M. D, h:mm:ss a') :
    'N/A';
  return (
    <Row>
      <Col className="card"
        xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
        <div className="clearfix">
          <h4 className="pull-left">{name}</h4>
          <div className="pull-right" style={{paddingTop: 10}}>
            <Label bsStyle="danger">{label}</Label>
          </div>
        </div>
        <Table striped bordered condensed hover responsive>
          <thead>
            <tr>
              <th>품목</th>
              <th>가격</th>
              <th>수량</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
          {
            _.map(stock, (v, k) => {
              return (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v['가격']}</td>
                  <td className="highlight" key={v.highlighted || 0}>
                    {v['수량']}
                  </td>
                  <td>{v['비고']}</td>
                </tr>
              );
            })
          }
          </tbody>
        </Table>
        <div className="clearfix">
          <div className="pull-right">
            <span style={{color: '#aaa'}}>업데이트 : {updated}</span>
          </div>
        </div>
      </Col>
    </Row>
  );
};

Stock.displayName = 'Stock';
Stock.defaultProps = {
  stock: {}
};
Stock.propTypes = {
  name: React.PropTypes.string.isRequired,
  stock: React.PropTypes.object,
  label: React.PropTypes.string,
  store: React.PropTypes.object
};

export default Stock;
