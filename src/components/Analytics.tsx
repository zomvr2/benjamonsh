'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

export default function Analytics() {
  useEffect(() => {
    clarity.init('tr9jgc71jp');
  }, []);

  return null;
}