import { Injectable } from '@nestjs/common';
import { EventQuery } from './models/event-query.model';
import { CreateEventQueryInput } from './dto/create-event-query.input';
import { FileUpload } from 'graphql-upload';
import { QueryDataService } from 'src/query-data/query-data.service';
import { UploadService } from 'src/upload/upload.service';
import format from 'date-fns/format';
import { appConstants } from '../constants';
import { Quote } from 'src/pricing/models/quote.model';
import { PricingService } from 'src/pricing/pricing.service';
import { CreateQueryRequest } from 'src/query-data/dto/create-query.request';
import { AttachmentDto } from 'src/query-data/dto/attachment.dto';
import { mapEventQuery } from './mappers/map-event-query';
import { orderBy } from 'lodash';
import { UpdateEventInfoInput } from './dto/update-event-info.input';
import { UpdateEventRequest } from 'src/query-data/dto/update-event.request';
import { ExpandEventQueryInput } from './dto/expand-event-query.input';
import { ExpandQueryRequest } from 'src/query-data/dto/expand-query.request';
import { DegreeSelection } from './models/degree-selection.model';
import { assert } from 'console';
import _ from 'lodash';
import { Percentage } from 'src/common/percentage.model';
import { Absolute } from 'src/common/absolute.model';

@Injectable()
export class QueriesService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly queryDataService: QueryDataService,
    private readonly pricingService: PricingService,
  ) {}

  async getCustomerQueries(customerId: string): Promise<EventQuery[]> {
    const response = await this.queryDataService.getCustomerQueries(customerId);
    const mappedResponse = response.map(mapEventQuery);
    return orderBy(mappedResponse, [r => r.eventDetails.startDate], ['desc']);
  }

  async getQuote(input: CreateEventQueryInput): Promise<Quote> {
    const studentCount = await this.queryDataService.getStudentCountForQuery(
      this.createQueryRequestMapper(input, 'dry-run'),
    );
    return this.pricingService.getQuote(studentCount);
  }

  async getQuery(queryId: string): Promise<EventQuery> {
    const response = await this.queryDataService.getQuery(queryId);
    return mapEventQuery(response);
  }

  async createEventQuery(
    input: CreateEventQueryInput,
    customerId: string,
  ): Promise<EventQuery> {
    const attachments = await this.handleAttachments(input.attachments);

    const queryId = await this.queryDataService.createQuery(
      this.createQueryRequestMapper(input, customerId, attachments),
    );

    const response = await this.queryDataService.getQuery(queryId);
    return mapEventQuery(response);
  }

  async updateEventInfo(
    queryId: string,
    input: UpdateEventInfoInput,
  ): Promise<EventQuery> {
    const attachments = await this.handleAttachments(input.attachments);

    const response = await this.queryDataService.updateEventInfo(
      queryId,
      this.updateEventRequestMapper(input, attachments),
    );
    return mapEventQuery(response);
  }

  async expandEventQuery(
    queryId: string,
    input: ExpandEventQueryInput,
  ): Promise<EventQuery> {
    const prevQueryParameters = await this.retrieveQueryParameters(queryId);
    this.checkInputQueryParameters(input, prevQueryParameters);
    const response = await this.queryDataService.expandQuery(
      queryId,
      this.expandEventRequestMapper(input),
    );
    return mapEventQuery(response);
  }

  private expandEventRequestMapper = (
    input: ExpandEventQueryInput,
  ): ExpandQueryRequest => ({
    details: input.degrees.map(d => ({
      degree_id: d.degreeId,
      absolute: d.absolute,
      percentage: d.percentage,
      degree_name: d.degreeName,
    })),
  });

  private createQueryRequestMapper = (
    input: CreateEventQueryInput,
    customerId: string,
    attachments: { filename: string; id: string; mimetype: string }[] = [],
  ): CreateQueryRequest => ({
    customer_id: customerId,
    event: {
      address: input.address,
      end_date: format(input.endDate, appConstants.dateFormat),
      info: input.info,
      message: input.message,
      attachments,
      name: input.name,
      start_date: format(input.startDate, appConstants.dateFormat),
      type: input.eventType,
      password: input.password,
    },
    query: {
      details: input.degrees.map(d => ({
        degree_id: d.degreeId,
        absolute: d.absolute,
        percentage: d.percentage,
        degree_name: d.degreeName,
      })),
    },
  });

  private updateEventRequestMapper = (
    input: UpdateEventInfoInput,
    attachments: { filename: string; id: string; mimetype: string }[] = [],
  ): UpdateEventRequest => ({
    address: input.address,
    attachments,
    end_date: input.endDate
      ? format(input.endDate, appConstants.dateFormat)
      : undefined,
    info: input.info,
    message: input.message,
    name: input.name,
    password: input.password,
    start_date: input.startDate
      ? format(input.startDate, appConstants.dateFormat)
      : undefined,
    type: input.eventType,
  });

  private checkInputQueryParameters(
    input: ExpandEventQueryInput,
    prevQueryParameters: DegreeSelection[],
  ) {
    const mappedNewSelection = _.chain(input.degrees)
      .map(
        (d): Omit<MergedSelection, 'oldValue'> => ({
          id: d.degreeId,
          newValue: d.absolute
            ? { absolute: d.absolute, amountType: 'Absolute' }
            : { percentage: d.percentage || 0, amountType: 'Percentage' },
        }),
      )
      .keyBy(d => d.id)
      .value();
    const mergedSelection = _.chain(prevQueryParameters)
      .map(d => ({
        id: d.degree.id,
        oldValue: d.amount,
      }))
      .keyBy(d => d.id)
      .merge(mappedNewSelection)
      .value();
    const allDegreesIncluded = _.every(mergedSelection, s => !!s.newValue);
    assert(
      allDegreesIncluded,
      'Input does not contain all previously selected degrees.',
    );
    const sameAmountTypes = _.every(mergedSelection, s =>
      s.oldValue ? s.newValue.amountType === s.oldValue.amountType : true,
    );
    assert(sameAmountTypes, 'Amount type changed.');
    const getValue = (amount: Percentage | Absolute) => {
      switch (amount.amountType) {
        case 'Percentage':
          return amount.percentage;
        case 'Absolute':
          return amount.absolute;
      }
    };
    const newValuesGte = _.every(mergedSelection, s =>
      s.oldValue ? getValue(s.newValue) >= getValue(s.oldValue) : true,
    );
    assert(newValuesGte, 'Amount is smaller than previous selection');
  }

  private async retrieveQueryParameters(queryId: string) {
    const oldQueryResponse = await this.queryDataService.getQuery(queryId);
    const oldDegrees = mapEventQuery(oldQueryResponse);
    return oldDegrees.queryDetails.parameters;
  }

  private async handleAttachments(
    files: Promise<FileUpload>[] = [],
  ): Promise<AttachmentDto[]> {
    return Promise.all(
      files.map(async filePromise => {
        const file = await filePromise;
        if (appConstants.acceptedMimetypes.includes(file.mimetype)) {
          try {
            const key = await this.uploadService.saveFile(file);
            return {
              filename: file.filename,
              id: key,
              mimetype: file.mimetype,
            };
          } catch (error) {
            /* eslint-disable @typescript-eslint/no-unsafe-member-access */
            if (error.name === 'PayloadTooLargeError') {
              throw new Error(
                `The file size exceeds ${appConstants.fileSize} mb`,
              );
            } else {
              throw error;
            }
            /* eslint-enable @typescript-eslint/no-unsafe-member-access */
          }
        } else {
          throw new Error(
            `The following mimetype is not accepted: ${file.mimetype}`,
          );
        }
      }),
    );
  }
}

type MergedSelection = {
  id: string;
  newValue: Percentage | Absolute;
  oldValue: Percentage | Absolute;
};
