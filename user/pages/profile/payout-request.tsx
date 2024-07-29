import PageTitle from '@components/page-title';
import { omit } from 'lodash';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { Component } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { loadPayoutRequest } from 'src/redux/payout-request/actions';
import { withAuth } from 'src/redux/withAuth';

const PayoutRequestHistory = dynamic(() => import('src/components/payout-request/payout-request-history'));
const PayoutRequestModal = dynamic(() => import('src/components/payout-request/payout-request-modal'));

interface IProps {
  items: any;
  total: any;
  loadPayoutRequest: Function;
  sendPayoutRequestStore: {
    requesting: boolean;
    success: boolean;
    error: any;
  };
}

interface IStates {
  showModal: boolean;
  page: number;
  take: number;
  sort: string;
  sortType: string;
  q: string;
  status: '' | 'pending' | 'paid' | 'approved' | 'rejected';
}

class PayoutRequestHistoryPage extends Component<IProps, IStates> {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      page: 1,
      take: 10,
      sort: '',
      sortType: '',
      q: '',
      status: ''
    };
  }

  componentDidMount() {
    const {
      page, take, sort, sortType, q
    } = this.state;
    this.props.loadPayoutRequest({
      page, take, sort, sortType, q
    });
  }

  // eslint-disable-next-line consistent-return
  componentDidUpdate(prevProps: IProps) {
    const { sendPayoutRequestStore } = this.props;
    if (
      prevProps.sendPayoutRequestStore?.requesting
      && !sendPayoutRequestStore.requesting
      && sendPayoutRequestStore.success
    ) {
      this.setState({ showModal: false }, () => toast.success('Die Auszahlungsanfrage war erfolgreich. Bitte warten Sie auf die Genehmigung durch den Administrator.'));
    } else if (
      prevProps.sendPayoutRequestStore?.requesting
      && !sendPayoutRequestStore.requesting
      && !sendPayoutRequestStore.success
      && sendPayoutRequestStore.error
    ) {
      return toast.error(sendPayoutRequestStore.error?.message || 'Senden der Auszahlungsanfrage fehlgeschlagen.');
    }
  }

  doGetPayoutRequest(newState: any) {
    this.setState(newState as IStates, () => {
      const {
        page, take, sort, sortType, q, status
      } = this.state;
      this.props.loadPayoutRequest({
        page, take, sort, sortType, q, status
      });
    });
  }

  render() {
    const { items, total } = this.props;
    const {
      take, q, showModal, status
    } = this.state;
    return (
      <main className="main scroll">
        <Container fluid className="p-3">
          <PageTitle title="Auszahlungsanforderung" />
          <Row className="m-2">
            <Col md={12}>
              <h4 className="font-weight-semibold">Auszahlungsanforderung</h4>
            </Col>
            <Col md={12} className="flex justify-content-end">
              <a onClick={() => Router.push('/profile/setting/payout-account', '/payout-account', { shallow: true })}>
                <a className="btn btn-primary text-light mx-2 my-1">Konto für Auszahlungen</a>
              </a>
              <a
                className="btn btn-warning text-light mx-2 my-1"
                onClick={() => this.setState({ showModal: true })}
              >
              Hinzufügen
              </a>
            </Col>
          </Row>
          <Row className="m-2">
            <Col>
              <div className="mgB20 flex ">
                <Col sm={6} lg={6} className="no-padL">
                Anzeigen
                  {' '}
                  <select
                    className="select-pageSize"
                    value={take}
                    onChange={(e) => this.doGetPayoutRequest({ take: Number(e.target.value) })}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                  {' '}
                  Einträge
                </Col>
                <Col sm={6} lg={6} className="no-padR">
                  <div className="search-box d-inline-block float-right ml-2 mt-2">
                  Suche :
                    {' '}
                    <input
                      type="text"
                      placeholder="Suche"
                      value={q}
                      onChange={(e) => this.doGetPayoutRequest({ q: e.target.value })}
                    />
                  </div>
                  <div className="search-box d-inline-block float-right mt-2">
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => this.doGetPayoutRequest({ status: e.target.value })}
                    >
                      <option value="">Alle</option>
                      <option value="pending">Ausstehend</option>
                      <option value="paid">Bezahlt</option>
                      <option value="approved">Akzeptiert</option>
                      <option value="rejected">Zurückgewiesen</option>
                    </select>
                  </div>
                </Col>
              </div>
              <PayoutRequestHistory
                items={items}
                total={total}
                handleGetPayoutRequest={this.doGetPayoutRequest.bind(this)}
                {...omit(this.state, ['showModal'])}
              />
            </Col>
          </Row>
          <PayoutRequestModal isShowModal={showModal} onCloseModal={() => this.setState({ showModal: false })} />
        </Container>
      </main>
    );
  }
}

const mapStateToProps = (state: any) => ({ ...state.payoutRequest });
const mapDispatch = { loadPayoutRequest };
export default withAuth(connect(mapStateToProps, mapDispatch)(PayoutRequestHistoryPage));
