import style from './payment-return.module.scss';

export function PaymentCancelForm() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto mt-5">
          <div className={style.payment}>
            <div className={style.payment_header}>
              <div className={style.check}><i className="fa fa-check" aria-hidden="true" /></div>
            </div>
            <div className={style.content}>
              <h1>Zahlung abgebrochen!</h1>
              <p>Hallo, Ihre Zahlung ist fehlgeschlagen. Bitte kontaktieren Sie uns für weitere Informationen!</p>
              <a href="/">Gehe zum Startbildschirm</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancelForm;
