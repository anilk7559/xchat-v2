import { Form } from 'react-bootstrap';

declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}
// declare module 'react-phone-input-2';

declare module 'react-bootrap' {
  interface Form {
    onSubmit: any;
  }
}
