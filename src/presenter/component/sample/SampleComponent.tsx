/**
 * 3파일 세트 예시 — Component (진입점)
 *
 * page.tsx에서 import하는 최상위 컴포넌트.
 * 'use client'는 여기서만 선언. page.tsx에서는 금지.
 */
'use client';

import { useState } from 'react';
import { SampleView } from './SampleView';
import { useSampleViewModel } from './SampleViewModel';

export function SampleComponent() {
  const viewModel = useSampleViewModel();

  return <SampleView {...viewModel} />;
}

/** Dashboard 페이지용 alias */
export const DashboardComponent = SampleComponent;
