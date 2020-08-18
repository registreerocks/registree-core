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
import { orderBy, intersection, isEqual } from 'lodash';
import { UpdateEventInfoInput } from './dto/update-event-info.input';
import { UpdateEventRequest } from 'src/query-data/dto/update-event.request';
import { ExpandEventQueryInput } from './dto/expand-event-query.input';
import { ExpandQueryRequest } from 'src/query-data/dto/expand-query.request';
import { DegreeSelection } from './models/degree-selection.model';

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
    await this.checkQueryParameters(queryId, input);
    const response = await this.queryDataService.expandQuery(
      queryId,
      this.expandEventRequestMapper(input),
    );
    return mapEventQuery(response);
  }

  private async checkQueryParameters(
    queryId: string,
    input: ExpandEventQueryInput,
  ): Promise<void> {
    const prevQueryParameters = await this.retrieveQueryParameters(queryId);
    this.checkExpand(input, prevQueryParameters);
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

  private checkExpand(
    input: ExpandEventQueryInput,
    prevQueryParameters: DegreeSelection[],
  ) {
    const oldSelection = prevQueryParameters.reduce(
      (obj, item) => ((obj[item.degree.id] = item.amount), obj),
      {},
    );
    const newSelection = {};
    input.degrees.forEach(degree => {
      if (degree.absolute)
        newSelection[degree.degreeId] = { absolute: degree.absolute };
      else newSelection[degree.degreeId] = { percentage: degree.percentage };
    });

    if (
      Object.keys(oldSelection).length ===
      intersection(Object.keys(oldSelection), Object.keys(newSelection)).length
    ) {
      Object.keys(newSelection).forEach(degreeId => {
        if (!Object.keys(oldSelection).includes(degreeId)) return;
        else {
          if (
            isEqual(
              Object.keys(oldSelection[degreeId]),
              Object.keys(newSelection[degreeId]),
            )
          ) {
            if (
              Object.values(oldSelection[degreeId]) <=
              Object.values(newSelection[degreeId])
            )
              return;
            else {
              throw new Error('Amount is smaller than in previous query.');
            }
          } else {
            throw new Error('Amount type changed.');
          }
        }
      });
    } else {
      throw new Error(
        'Input does not contain all previously selected degrees.',
      );
    }
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
