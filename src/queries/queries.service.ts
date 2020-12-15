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
import { UniversitiesService } from 'src/universities/universities.service';
import { Degree } from 'src/universities/models/degree.model';
import { ApolloError, ValidationError } from 'apollo-server-express';
import { UpdateQueryInviteStatus } from 'src/query-data/dto/update-query-invite-status.request';
import { CustomersService } from 'src/customers/customers.service';
import { UpdateStudentLink } from 'src/query-data/dto/update-student-link.request';
import { UserInputError } from 'apollo-server-express';

@Injectable()
export class QueriesService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly queryDataService: QueryDataService,
    private readonly pricingService: PricingService,
    private readonly identifyingDataService: IdentifyingDataService,
    private readonly linkingDataService: LinkingDataService,
    private readonly universitiesService: UniversitiesService,
    private readonly customersService: CustomersService,
  ) {}

  async getCustomerQueries(customerId: string): Promise<EventQuery[]> {
    const response = await this.queryDataService.getCustomerQueries(customerId);
    const mappedResponse = response.map(mapEventQuery);
    return orderBy(mappedResponse, [r => r.eventDetails.startDate], ['desc']);
  }

  async getStudentQueries(studentNumber: string): Promise<EventQuery[]> {
    const transcriptId = await this.getTranscriptIdFromStudentNumber(
      studentNumber,
    );
    const response = await this.queryDataService.getStudentQueries(
      transcriptId,
    );
    const mappedResponse = response.map(mapEventQuery).map(q => ({
      ...q,
      eventDetails: {
        ...q.eventDetails,
        invites: q.eventDetails.invites.filter(
          x => x.transcriptId === transcriptId,
        ),
      },
    }));
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
    userId: string,
  ): Promise<EventQuery> {
    const customerId = (await this.customersService.findOneByUserId(userId))
      ?.id;
    if (!customerId) {
      throw new Error(`Customer for user with id: ${userId} not found.`);
    }
    const attachments = await this.handleAttachments(input.attachments);

    const degrees = await this.getDegreesById(
      input.degrees.map(d => d.degreeId),
    );
    const queryId = await this.queryDataService.createQuery(
      this.createQueryRequestMapper(input, customerId, attachments, degrees),
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
    const degrees = await this.getDegreesById(
      input.degrees.map(d => d.degreeId),
    );
    const response = await this.queryDataService.expandQuery(
      queryId,
      this.expandEventRequestMapper(input, degrees),
    );
    return mapEventQuery(response);
  }

  async updateQueryInvite(
    queryId: string,
    studentNumber: string,
    input: UpdateQueryInviteStatus,
  ): Promise<EventQuery> {
    const transcriptId = await this.getTranscriptIdFromStudentNumber(
      studentNumber,
    );

    const query = await this.getQuery(queryId);
    const invite = query.eventDetails.invites.find(
      x => x.transcriptId === transcriptId,
    );

    if (invite && invite.attended === true) {
      throw new UserInputError(
        'Not allowed to modify the event invite after the event has been attended.',
      );
    }

    const response = await this.queryDataService.updateQueryInviteStatus(
      queryId,
      {
        ...input,
        viewed: input.viewed ?? (!!invite?.viewedAt ? undefined : true),
        student_address: transcriptId,
      },
    );
    const mappedResponse = mapEventQuery(response);
    const filteredResponse = {
      ...mappedResponse,
      eventDetails: {
        ...mappedResponse.eventDetails,
        invites: mappedResponse.eventDetails.invites.filter(
          x => x.transcriptId === transcriptId,
        ),
      },
    };
    return filteredResponse;
  }

  async linkStudent(
    queryId: string,
    studentNumber: string,
    input: UpdateStudentLink,
  ) {
    const transcriptId = await this.getTranscriptIdFromStudentNumber(
      studentNumber,
    );
    await this.queryDataService.linkStudent(queryId, {
      ...input,
      student_address: transcriptId,
    });
  }

  private async getTranscriptIdFromStudentNumber(
    studentNumber: string,
  ): Promise<string> {
    const identifyingData = await this.identifyingDataService.getIdentifyingData(
      studentNumber,
    );
    const transcriptId = await this.linkingDataService.getTranscriptId(
      identifyingData[0]['_id'],
      'http://localhost:8001',
    );
    return transcriptId;
  }

  private async getDegreesById(
    degreeIds: readonly string[],
  ): Promise<Degree[]> {
    const degrees = await this.universitiesService.getDegreesById(degreeIds);
    if (degreeIds.every(x => degrees.find(d => d.id === x))) {
      return degrees;
    } else {
      throw new ApolloError('degrees provided not found', 'NOT_FOUND');
    }
  }

  private expandEventRequestMapper = (
    input: ExpandEventQueryInput,
    degrees: Degree[],
  ): ExpandQueryRequest => ({
    details: input.degrees.map(d => ({
      degree_id: d.degreeId,
      absolute: d.absolute,
      percentage: d.percentage,
      degree_name: degrees.find(deg => deg.id === d.degreeId)?.name || '',
    })),
  });

  private createQueryRequestMapper = (
    input: CreateEventQueryInput,
    customerId: string,
    attachments: { filename: string; id: string; mimetype: string }[] = [],
    degrees: Degree[] = [],
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
        degree_name: degrees.find(deg => deg.id === d.degreeId)?.name || '',
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
      throw new ValidationError(
        'Input does not contain all previously selected degrees.',
      );
    const amountTypesMatch = _.every(mergedQueryParameters, s =>
      s.prevParams ? s.newParams.amountType === s.prevParams.amountType : true,
    );
    if (!amountTypesMatch) throw new ValidationError('Amount type changed.');

    const newAmountGtePrevAmount = _.every(mergedQueryParameters, s =>
      s.prevParams
        ? getUnionValue(s.newParams) >= getUnionValue(s.prevParams)
        : true,
    );
    if (!newAmountGtePrevAmount)
      throw new ValidationError('Amount is smaller than in previous selection');
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
              throw new ValidationError(
                `The file size exceeds ${appConstants.fileSize} mb`,
              );
            } else {
              throw error;
            }
            /* eslint-enable @typescript-eslint/no-unsafe-member-access */
          }
        } else {
          throw new ValidationError(
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
