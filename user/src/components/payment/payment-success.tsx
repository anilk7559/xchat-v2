import style from './payment-return.module.scss';

export function PaymentSuccessForm() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mx-auto mt-5">
          <div className={style.payment}>
            <div className={style.payment_header}>
              <div className={style.check}><i className="fa fa-check" aria-hidden="true" /></div>
            </div>
            <div className={style.content}>
              <h1>Zahlung erfolgreich!</h1>
              <p>Hallo, Ihre Zahlung wurde erfolgreich verarbeitet.</p>
              <a href="/">Gehe zum Startbildschirm</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessForm;
