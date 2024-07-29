import * as React from 'react';
import { Col, Row, Button } from 'reactstrap';
import Moment from 'react-moment';
import Link from 'next/link';
import ModalUpdatePayout from './modal-update-status';

interface IProps {
  data?: any;
}

const statusItem = (status: string) => {
  // eslint-disable-next-line no-nested-ternary
  const classStatus = status === 'pending' ? 'warning' : status === 'approved' ? 'primary' : status === 'paid' ? 'success' : 'danger';
  return (
    <span className={`badge badge-${classStatus}`} style={{ textTransform: 'capitalize' }}>
      {status}
    </span>
  );
};

const PayoutDetail: React.FunctionComponent<IProps> = ({ data = null }) => {
  const [modalShow, setModal] = React.useState(false);
  const [action, setAction] = React.useState('');

  const actionUpdate = (a: string) => {
    setAction(a);
    setModal(true);
  };

  const convertAccountType = (type: string) => {
    const accountType = type === 'bank' ? 'Wire Transfer' : type;
    // eslint-disable-next-line no-nested-ternary
    const classType = type === 'bank' ? 'warning' : type === 'paypal' ? 'primary' : 'danger';
    return (
      <span className={`badge badge-${classType}`} style={{ textTransform: 'capitalize' }}>
        {accountType}
      </span>
    );
  };

  const accountInfo = (d: any) => {
    if (d.type === 'bank') {
      return (
        <>
          <li>
            <strong>Bank name: </strong>
            <p>{d.bankInfo.bankName}</p>
          </li>
          <li>
            <strong>Bank address: </strong>
            <p>{d.bankInfo.bankAddress}</p>
          </li>
          <li>
            <strong>IBAN: </strong>
            <p>{d.bankInfo.iban}</p>
          </li>
          <li>
            <strong>SWIFT/BIC: </strong>
            <p>{d.bankInfo.swift}</p>
          </li>
          <li>
            <strong>Beneficiary name: </strong>
            <p>{d.bankInfo.beneficiaryName}</p>
          </li>
          <li>
            <strong>Beneficiary address: </strong>
            <p>{d.bankInfo.beneficiaryAddress}</p>
          </li>
        </>
      );
    }
    return (
      <li>
        <strong>Email: </strong>
        <p>{data.email}</p>
      </li>
    );
  };

  return (
    <Row className="info-sell-item">
      {modalShow && <ModalUpdatePayout modalShow={modalShow} setModal={setModal} action={action} data={data} />}
      {data && data._id
        ? [
          <Col md={12} className="box-detail-pay" key="data">
            <ul>
              <li>
                <strong>Model: </strong>
                <p>{data?.model?.username || 'None'}</p>
              </li>
              <li>
                <strong>Total: </strong>
                <p>{data.tokenRequest && data.tokenRequest}</p>
              </li>
              {/* <li>
                  <strong>Commission: </strong>
                  <p>{data.commission && data.commission}</p>
                </li>
                <li>
                  <strong>Received: </strong>
                  <p>{data.balance && data.balance}</p>
                </li> */}
              <li>
                <strong>Status: </strong>
                <p>{statusItem(data.status)}</p>
              </li>
              <li>
                <strong>Create At: </strong>
                <p>
                  <Moment format="YYYY-MM-DD">{data.createdAt}</Moment>
                </p>
              </li>
              <li className="border-top border-secondary">
                <strong>Payment system: </strong>
                <p>{data.payoutAccount && data.payoutAccount.type && convertAccountType(data.payoutAccount.type)}</p>
              </li>

              {data.payoutAccount && accountInfo(data.payoutAccount)}

              <li>
                {data.status !== 'paid' && (
                <>
                  {data.status !== 'approved' && (
                  <Button type="button" color="primary" outline onClick={() => actionUpdate('approve')}>
                    Approve
                  </Button>
                  )}
                  {data.status === 'approved' && (
                  <Button type="button" color="success" outline onClick={() => actionUpdate('paid')}>
                    Confirm Paid This Payout Request
                  </Button>
                  )}
                  {data.status !== 'rejected' && (
                  <Button type="button" color="danger" outline onClick={() => actionUpdate('reject')}>
                    Reject
                  </Button>
                  )}
                </>
                )}
                <Link legacyBehavior href={`/earnings/listing?modelId=${data.modelId}`}>
                  <a id="review" className="btn btn-outline-info">
                    Review earning of model
                  </a>
                </Link>
              </li>
            </ul>
          </Col>
        ]
        : null}
    </Row>
  );
};

export default PayoutDetail;
