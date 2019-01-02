import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef
} from '@angular/core';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';
import { trackByEventId } from '../common/util';
import { PlacementArray } from 'positioning';

@Component({
  selector: 'mwl-calendar-month-cell',
  template: `
    <ng-template
      #defaultTemplate
      let-day="day"
      let-openDay="openDay"
      let-locale="locale"
      let-tooltipPlacement="tooltipPlacement"
      let-highlightDay="highlightDay"
      let-unhighlightDay="unhighlightDay"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
    >
      <div class="cal-cell-top cal-cell-top-mob">
        
        <span class="cal-day-number">{{
          day.date | calendarDate: 'monthViewDayNumber':locale
        }}</span>
      </div>
      <div class="cal-events" *ngIf="day.events.length > 0">
        <div
          class="cal-event"
          *ngFor="let event of day.events; trackBy: trackByEventId"
          [style.backgroundColor]="event.color?.primary"
          [ngClass]="event?.cssClass"
        ></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        openDay: openDay,
        locale: locale,
        tooltipPlacement: tooltipPlacement,
        highlightDay: highlightDay,
        unhighlightDay: unhighlightDay,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody
      }"
    >
    </ng-template>
  `,
  host: {
    class: 'cal-cell cal-day-cell',
    '[class.cal-past]': 'day.isPast',
    '[class.cal-today]': 'day.isToday',
    '[class.cal-future]': 'day.isFuture',
    '[class.cal-weekend]': 'day.isWeekend',
    '[class.cal-in-month]': 'day.inMonth',
    '[class.cal-out-month]': '!day.inMonth',
    '[class.cal-has-events]': 'day.events.length > 0',
    '[class.cal-open]': 'day === openDay',
    '[class.cal-event-highlight]': '!!day.backgroundColor',
    '[style.backgroundColor]': 'day.backgroundColor'
  },
  styleUrls: ['../../css/angular-calendar.css']
})
export class CalendarMonthCellComponent {
  @Input() day: MonthViewDay;

  @Input() openDay: MonthViewDay;

  @Input() locale: string;

  @Input() tooltipPlacement: PlacementArray;

  @Input() tooltipAppendToBody: boolean;

  @Input() customTemplate: TemplateRef<any>;

  @Input() tooltipTemplate: TemplateRef<any>;

  @Output() highlightDay: EventEmitter<any> = new EventEmitter();

  @Output() unhighlightDay: EventEmitter<any> = new EventEmitter();

  @Output()
  eventClicked: EventEmitter<{ event: CalendarEvent }> = new EventEmitter<{
    event: CalendarEvent;
  }>();

  trackByEventId = trackByEventId;
}
