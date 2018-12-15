import { Component, Input, TemplateRef } from '@angular/core';
import { WeekDay } from 'calendar-utils';
import { trackByWeekDayHeaderDate } from '../common/util';

@Component({
  selector: 'mwl-calendar-month-view-header',
  template: `
    <ng-template #defaultTemplate let-days="days" let-locale="locale">
      <div class="cal-cell-row cal-header web-view">
        <div
          class="cal-cell"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          [ngClass]="day.cssClass"
          >
        {{ day.date | calendarDate: 'monthViewColumnHeader':locale }}
        </div>
      </div>
      <div class="cal-cell-row cal-header mobile-view">
        <div
          class="cal-cell"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          [ngClass]="day.cssClass"
        >
        {{ day.date | date: 'EEE' }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{ days: days, locale: locale }"
    >
    </ng-template>
  `,
  styleUrls: ['../../css/angular-calendar.css']
})
export class CalendarMonthViewHeaderComponent {
  @Input() days: WeekDay[];

  @Input() locale: string;

  @Input() customTemplate: TemplateRef<any>;

  trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
}
