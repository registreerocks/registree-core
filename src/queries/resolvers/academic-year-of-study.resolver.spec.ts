import { INestApplication } from '@nestjs/common';
import { GraphQLModule, GraphQLSchemaHost } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-core';
import { GraphQLSchema, printSchema } from 'graphql';
import { execGraphQL } from '../../common/test.helpers';
import { AcademicYearOfStudyResolver } from './academic-year-of-study.resolver';

describe('AcademicYearOfStudyResolver', () => {
  let app: INestApplication;
  let schema: GraphQLSchema;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot({ autoSchemaFile: true })],
      providers: [AcademicYearOfStudyResolver],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const schemaHost: GraphQLSchemaHost = app.get(GraphQLSchemaHost);
    schema = schemaHost.schema;
  });

  afterAll(async () => {
    await app.close();
  });

  test('getAcademicYearOfStudyLabels', async () => {
    const query = gql`
      query {
        getAcademicYearOfStudyLabels {
          academicYearOfStudy
          label
        }
      }
    `;
    expect(await execGraphQL(schema, query)).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "getAcademicYearOfStudyLabels": Array [
            Object {
              "academicYearOfStudy": "YEAR_1",
              "label": "1st year",
            },
            Object {
              "academicYearOfStudy": "YEAR_2",
              "label": "2nd year",
            },
            Object {
              "academicYearOfStudy": "YEAR_3_PLUS",
              "label": "3rd year +",
            },
          ],
        },
      }
    `);
  });

  test('schema snapshot', () => {
    expect(printSchema(schema)).toMatchInlineSnapshot(`
      "\\"\\"\\"A labelled academic year of study.\\"\\"\\"
      type AcademicYearOfStudyLabel {
        academicYearOfStudy: AcademicYearOfStudy!

        \\"\\"\\"User-facing label for this year.\\"\\"\\"
        label: String!
      }

      \\"\\"\\"The academic year of study a student is in.\\"\\"\\"
      enum AcademicYearOfStudy {
        YEAR_1
        YEAR_2
        YEAR_3_PLUS
      }

      type Query {
        \\"\\"\\"Get academic years of study to display.\\"\\"\\"
        getAcademicYearOfStudyLabels: [AcademicYearOfStudyLabel!]!
      }
      "
    `);
  });
});
