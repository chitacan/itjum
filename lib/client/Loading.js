import React from 'react';
import {Row, Col, Alert} from 'react-bootstrap';

const Loading = props => {
  const {message, ...rest} = props;
  return (
    <Row {...rest}>
      <Col xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
        <Alert bsStyle="warning">
          <span className="loading"/>
          &nbsp;&nbsp;
          <span>{message}</span>
        </Alert>
      </Col>
    </Row>
  );
};

Loading.displayName = 'Loading';
Loading.defaultProps = {
  message: '로딩 중'
};
Loading.propTypes = {
  message: React.PropTypes.string
};

export default Loading;
