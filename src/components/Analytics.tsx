'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import clarity from '@microsoft/clarity';

export default function Analytics() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    // El panel no se graba: ahí hay borradores y datos privados.
    if (!isAdmin) clarity.init('tr9jgc71jp');
  }, [isAdmin]);

  return null;
}
