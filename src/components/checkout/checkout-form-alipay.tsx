'use client'
import React, { useEffect } from 'react';

interface AlipayFormProps {
  action: string;
  data: { [key: string]: string };
}

const AlipayCheckoutForm: React.FC<AlipayFormProps> = ({ action, data }) => {
  useEffect(() => {
    const form = document.getElementById('alipay-form') as HTMLFormElement;
    if (form) {
      form.submit();
    }
  }, []);

  return (
    <form id="alipay-form" action={action} method="POST">
      {Object.keys(data).map((key) => (
        <input key={key} type="hidden" name={key} value={data[key]} />
      ))}
    </form>
  );
};

export default AlipayCheckoutForm;