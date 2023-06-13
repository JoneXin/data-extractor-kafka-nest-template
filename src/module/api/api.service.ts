import { systemSettings } from '../../config/sys.config';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataExtractService } from '../data_extract/de.service';

@Injectable()
export class ApiService {
    constructor() {}

    test() {
        return 1;
    }
}
