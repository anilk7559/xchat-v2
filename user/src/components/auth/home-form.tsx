import { Formik, FormikHelpers, FormikProps } from 'formik';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { authService } from 'src/services/auth.service';
import * as Yup from 'yup';

// interface IFormValues {
//   email: string;
// }

// const Loader = dynamic(() => import('src/components/common-layout/loader/loader'), { ssr: false });

// const schema = Yup.object().shape({
//   email: Yup.string().email('E-Mail-Format ist nicht korrekt').required('E-Mail wird benötigt')
// });


function HomeForm() {
//   const [requesting, setRequesting] = useState(false);
//   const forgotPassword = async (data: any) => {
//     await authService
//       .forgot(data)
//       .then((resp) => {
//         toast.success(resp?.data?.data?.message || 'Anfrage erfolgreich gesendet! Bitte überprüfen Sie Ihre E-Mail.');
//         Router.push('/auth/login');
//       })
//       .catch(async (e) => {
//         const error = await Promise.resolve(e);
//         return toast.error(error?.data?.message || 'Es ist ein Fehler aufgetreten!');
//       });
//     setRequesting(false);
//   };

  return (
<h1>this is home page</h1>
  );
}

export default HomeForm;
