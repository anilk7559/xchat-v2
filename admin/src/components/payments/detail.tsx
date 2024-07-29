import * as React from 'react';
import { Col, Row } from 'reactstrap';
import Moment from 'react-moment';

interface IProps {
  data: any;
}

function PaymentDetail({ data }: IProps) {
  return (
    <Row className="info-sell-item">
      {data && data._id
        ? [
          <Col md={12} className="box-detail-pay">
            <ul>
              <li>
                <strong>Fan: </strong>
                <p>
                  {data.user && data.user.username ? (
                    data.user.username
                  ) : (
                    <span className="badge badge-danger">No name</span>
                  )}
                </p>
              </li>
              <li>
                <strong>Price: </strong>
                <p>
                  {data.price ? data.price : 0}
                  {' '}
                  tokens
                </p>
              </li>
              <li>
                <strong>Gateway: </strong>
                <p>{data?.gateway}</p>
              </li>
              {/* <li>
                  <strong>Status: </strong>
                  <p>{data.meta && statusItem(data.meta.status)}</p>
                </li> */}
              <li>
                <strong>Transaction ID: </strong>
                <p>{data.meta ? data.meta.transactionId : <span className="badge badge-danger">No info</span>}</p>
              </li>
              <li>
                <strong>Payment Date:</strong>
                <p>
                  {data.meta ? (
                    <Moment format="YYYY-MM-DD">{data.meta.timestamp}</Moment>
                  ) : (
                    <span className="badge badge-danger">No info</span>
                  )}
                </p>
              </li>
              <li>
                <strong>Description: </strong>
                <p>{data.description && data.description}</p>
              </li>
            </ul>
          </Col>
        ]
        : null}
    </Row>
  );
}

export default PaymentDetail;
