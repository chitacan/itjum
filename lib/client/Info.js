import React from 'react';
import {Row, Col, Table} from 'react-bootstrap';

const version = __VERSION__;

const Info = () => {
  return (
    <Row>
      <Col className="card"
        xs={10} sm={8} md={8} xsOffset={1} smOffset={2} mdOffset={2}>
        <h4>앱 정보</h4>
        <Table striped responsive>
          <tbody>
          <tr>
            <td>버전</td>
            <td>{version}</td>
          </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

Info.displayName = 'Info';

export default Info;
