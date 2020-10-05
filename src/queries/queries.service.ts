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
import _ from 'lodash';
import { Percentage } from 'src/common/percentage.model';
import { Absolute } from 'src/common/absolute.model';
import { getUnionValue } from 'src/common/amount.union';
import { IdentifyingDataService } from 'src/identifying-data/identifying-data.service';
import { LinkingDataService } from 'src/linking-data/linking-data.service';

@Injectable()
export class QueriesService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly queryDataService: QueryDataService,
    private readonly pricingService: PricingService,
    private readonly identifyingDataService: IdentifyingDataService,
    private readonly linkingDataService: LinkingDataService,
  ) {}

  async getCustomerQueries(customerId: string): Promise<EventQuery[]> {
    const response = await this.queryDataService.getCustomerQueries(customerId);
    const mappedResponse = response.map(mapEventQuery);
    return orderBy(mappedResponse, [r => r.eventDetails.startDate], ['desc']);
  }

  async getStudentQueries(studentNumber: string): Promise<EventQuery[]> {
    const identifyingData = await this.identifyingDataService.getIdentifyingData(
      studentNumber,
    );
    const transcriptId = await this.linkingDataService.getTranscriptId(
      identifyingData[0]['_id'],
      'http://localhost:8001',
    );
    const response = await this.queryDataService.getStudentQueries(
      transcriptId,
    );
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
    const response = await this.queryDataService.updateEventInfo(
      queryId,
      this.updateEventRequestMapper(input),
    );
    return mapEventQuery(response);
  }

  async addAttachments(
    queryId: string,
    input: Promise<FileUpload>[],
  ): Promise<EventQuery> {
    const processedAttachments = await this.handleAttachments(input);
    const response = await this.queryDataService.addAttachments(
      queryId,
      processedAttachments,
    );
    return mapEventQuery(response);
  }

  async deleteAttachments(
    queryId: string,
    input: string[],
  ): Promise<EventQuery> {
    const response = await this.queryDataService.deleteAttachments(
      queryId,
      input,
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
      info: input.information,
      message: input.message ? input.message : '',
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
  ): UpdateEventRequest => ({
    address: input.address,
    end_date: input.endDate
      ? format(input.endDate, appConstants.dateFormat)
      : undefined,
    info: input.information,
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
    prevQueryParams: DegreeSelection[],
  ) {
    const mappedNewQueryParams = _.chain(input.degrees)
      .map(
        (d): Omit<MergedSelection, 'prevParams'> => ({
          id: d.degreeId,
          newParams: d.absolute
            ? { absolute: d.absolute, amountType: 'Absolute' }
            : { percentage: d.percentage || 0, amountType: 'Percentage' },
        }),
      )
      .keyBy(d => d.id)
      .value();
    const mergedQueryParameters = _.chain(prevQueryParams)
      .map(d => ({
        id: d.degreeId,
        prevParams: d.amount,
      }))
      .keyBy(d => d.id)
      .merge(mappedNewQueryParams)
      .value();
    const prevDegreesIncludedInInput = _.every(
      mergedQueryParameters,
      s => !!s.newParams,
    );
    if (!prevDegreesIncludedInInput)
      throw new Error(
        'Input does not contain all previously selected degrees.',
      );
    const amountTypesMatch = _.every(mergedQueryParameters, s =>
      s.prevParams ? s.newParams.amountType === s.prevParams.amountType : true,
    );
    if (!amountTypesMatch) throw new Error('Amount type changed.');

    const newAmountGtePrevAmount = _.every(mergedQueryParameters, s =>
      s.prevParams
        ? getUnionValue(s.newParams) >= getUnionValue(s.prevParams)
        : true,
    );
    if (!newAmountGtePrevAmount)
      throw new Error('Amount is smaller than in previous selection');
  }

  private async retrieveQueryParameters(queryId: string) {
    const oldQueryResponse = await this.queryDataService.getQuery(queryId);
    const oldDegrees = mapEventQuery(oldQueryResponse);
    return oldDegrees.queryDetails.parameters;
  }

  private async handleAttachments(
    files?: Promise<FileUpload>[],
  ): Promise<AttachmentDto[]> {
    return Promise.all(
      (files || []).map(async filePromise => {
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
  newParams: Percentage | Absolute;
  prevParams: Percentage | Absolute;
};
