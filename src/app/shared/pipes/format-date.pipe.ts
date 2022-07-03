import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import * as moment from 'moment';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
    transform(unixTimestamp: Timestamp): string {
        if (unixTimestamp === null) return '';
        return moment(unixTimestamp.toDate()).format('YYYY MMMM D');

    }
}