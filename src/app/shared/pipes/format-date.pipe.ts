import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
    transform(unixTimestamp: number): string {
        if (unixTimestamp === null) return '';
        return moment.unix(unixTimestamp).format('YYYY MMMM D');
    }
}