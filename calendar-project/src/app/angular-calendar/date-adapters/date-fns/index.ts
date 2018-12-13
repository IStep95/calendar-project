import { adapterFactory as baseAdapterFactory } from 'calendar-utils/date-adapters/date-fns';
import * as addWeeks from 'date-fns';
import * as addMonths from 'date-fns';
import * as subDays from 'date-fns';
import * as subWeeks from 'date-fns';
import * as subMonths from 'date-fns';
import * as getISOWeek from 'date-fns';
import * as setDate from 'date-fns';
import * as setMonth from 'date-fns';
import * as setYear from 'date-fns';
import * as getDate from 'date-fns';
import * as getYear from 'date-fns';
import { DateAdapter } from '../date-adapter';

export function adapterFactory(): DateAdapter {
  return {
    ...baseAdapterFactory(),
    addWeeks,
    addMonths,
    subDays,
    subWeeks,
    subMonths,
    getISOWeek,
    setDate,
    setMonth,
    setYear,
    getDate,
    getYear
  };
}
